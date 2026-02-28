import crypto from 'crypto'

export async function uploadFile(base64Data, folder) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  const timestamp = Math.round(Date.now() / 1000)
  const folderPath = `chuangku/${folder}`

  // Cloudinary signature: sort params alphabetically, NO api_key, NO file
  const paramsToSign = { folder: folderPath, timestamp: timestamp }
  const sortedKeys = Object.keys(paramsToSign).sort()
  const signStr = sortedKeys.map(k => `${k}=${paramsToSign[k]}`).join('&') + apiSecret
  
  console.log('String to sign:', signStr)
  const signature = crypto.createHash('sha1').update(signStr).digest('hex')

  const formData = new FormData()
  formData.append('file', base64Data)
  formData.append('folder', folderPath)
  formData.append('timestamp', String(timestamp))
  formData.append('api_key', apiKey)
  formData.append('signature', signature)

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: 'POST',
    body: formData
  })

  const data = await res.json()
  console.log('Cloudinary:', JSON.stringify(data).substring(0, 300))

  if (data.error) throw new Error(data.error.message)
  return { url: data.secure_url, publicId: data.public_id }
}
