export async function uploadFile(base64Data, folder, resourceType = 'auto') {
  const { v2: cloudinary } = await import('cloudinary')
  
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })

  const result = await cloudinary.uploader.upload(base64Data, {
    folder: `chuangku/${folder}`,
    resource_type: resourceType,
  })
  
  return { url: result.secure_url, publicId: result.public_id }
}
