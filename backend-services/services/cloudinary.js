import { v2 as cloudinary } from 'cloudinary'
import { CLOUDINARY_VALUES } from '../constants.js'

cloudinary.config({
	cloud_name: CLOUDINARY_VALUES.cloudName,
	api_key: CLOUDINARY_VALUES.apiKey,
	api_secret: CLOUDINARY_VALUES.apiSecret,
})

export const uploadImage = async (file) => {
	const result = await cloudinary.uploader.unsigned_upload(
		file,
		CLOUDINARY_VALUES.uploadPreset,
	)
	return result
}
