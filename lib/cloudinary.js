export async function uploadFile(base64Data, folder) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  const timestamp = Math.round(Date.now() / 1000)
  const folderPath = `chuangku/${folder}`
  
  // Generate signature
  const crypto = await import('crypto')
  const signStr = `folder=${folderPath}&timestamp=${timestamp}${apiSecret}`
  const signature = crypto.createHash('sha1').update(signStr).digest('hex')

  const formData = new FormData()
  formData.append('file', base64Data)
  formData.append('folder', folderPath)
  formData.append('timestamp', timestamp)
  formData.append('api_key', apiKey)
  formData.append('signature', signature)

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: 'POST',
    body: formData
  })

  const data = await res.json()
  if (data.error) throw new Error(data.error.message)
  
  return { url: data.secure_url, publicId: data.public_id }
}
