export const SHORTURL_VALUES = {
	initialLength: 6,
	maxAttempts: 20,
	maxLength: 12,
}

export const LIMITS_VALUES = {
	limitShortUrlPerDay: 10,
	limitQrCodePerDay: 5,
}

export const CLOUDINARY_VALUES = {
	cloudName: process.env.CLOUDINARY_CLOUD_NAME,
	apiKey: process.env.CLOUDINARY_API_KEY,
	apiSecret: process.env.CLOUDINARY_API_SECRET,
	uploadPreset: 'min-url',
}
