import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadFile(base64Data, folder, resourceType = 'auto') {
  const result = await cloudinary.uploader.upload(base64Data, {
    folder: `chuangku/${folder}`,
    resource_type: resourceType,
  })
  return { url: result.secure_url, publicId: result.public_id, originalFilename: result.original_filename }
}

export async function deleteFile(publicId) {
  await cloudinary.uploader.destroy(publicId)
}

export default cloudinary
