import {
	getUserIfShortUrlAvailable,
	getUserIfQrCodeAvailable,
} from '../models/UserModel.js'

export const checkShortUrlAvailable = async (req, res, next) => {
	const user = await getUserIfShortUrlAvailable(req.body.userId)
	if (user) {
		return next()
	}
	res.status(403).json({
		message: 'No available short url',
	})
}

export const checkQrCodeAvailable = async (req, res, next) => {
	const user = await getUserIfQrCodeAvailable(req.body.userId)
	if (user) {
		return next()
	}
	res.status(403).json({
		message: 'No available qr code',
	})
}
