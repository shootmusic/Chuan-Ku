import crypto from 'crypto'

export async function uploadFile(base64Data, folder) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  const timestamp = Math.round(Date.now() / 1000)
  const folderPath = `chuangku/${folder}`

  // Signature harus diurutkan alphabetically
  const signStr = `folder=${folderPath}&timestamp=${timestamp}${apiSecret}`
  const signature = crypto.createHash('sha1').update(signStr).digest('hex')

  const params = new URLSearchParams()
  params.append('file', base64Data)
  params.append('folder', folderPath)
  params.append('timestamp', String(timestamp))
  params.append('api_key', apiKey)
  params.append('signature', signature)

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString()
  })

  const data = await res.json()
  console.log('Cloudinary:', JSON.stringify(data).substring(0, 200))

  if (data.error) throw new Error(data.error.message)
  return { url: data.secure_url, publicId: data.public_id }
}
