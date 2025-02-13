import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const uploadImage = async (file) => {
	const result = await cloudinary.uploader.unsigned_upload(file, 'min-url')
	return result
}
