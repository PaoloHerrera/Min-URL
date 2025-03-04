import { Op } from 'sequelize'
import { UrlModel } from '../models/Url.js'
import { LIMITS_VALUES } from '../constants.js'

const getStartOfDay = (date) => {
	const startOfDay = new Date(date)
	startOfDay.setHours(0, 0, 0, 0)
	return startOfDay
}

// Este middleware se encarga de limitar el número de solicitudes de un usuario por día
// Si se supera el límite, se devuelve un error 429
const createRateLimitMiddleware = (purpose, limitType) => {
	return async (req, res, next) => {
		try {
			const ip = req.ip
			const startOfDay = getStartOfDay(new Date())
			const limit = LIMITS_VALUES[limitType]

			const urlCount = await UrlModel.count({
				where: {
					// biome-ignore lint/style/useNamingConvention: UrlModel need use snake case
					ip_address: ip,
					purpose,
					// biome-ignore lint/style/useNamingConvention: UrlModel need use snake case
					created_at: {
						[Op.gte]: startOfDay, // Mayor o igual a la medianoche de hoy
					},
				},
			})

			// Si el límite de solicitudes es superior al límite fijado, se devuelve un error 429
			if (urlCount >= limit) {
				const typeLimit = purpose === 'direct' ? 'URL' : 'QR Code'
				return res.status(429).json({
					message: `Limit of ${limit} ${typeLimit} per day reached. Try again tomorrow.`,
				})
			}

			next()
		} catch (error) {
			console.error('Error en el middleware de límite de solicitudes:', error)
			res.status(500).json({
				message: 'Server error. Try again later.',
			})
		}
	}
}

export const limitShortUrlPerDay = createRateLimitMiddleware(
	'direct',
	'limitShortUrlPerDay',
)

export const limitQrCodePerDay = createRateLimitMiddleware(
	'qr',
	'limitQrCodePerDay',
)
