import { lookupGeolocation } from '../utils/geo.js'

export const verifyGeoIp = (req, res, next) => {
	// Capturamos la ip del usuario
	const originalIp =
		process.env.NODE_ENV === 'development' ? process.env.LOCAL_IP : req.clientIp
	const geo = lookupGeolocation(originalIp)

	// Verifica si geo es vacío
	if (Object.keys(geo).length === 0) {
		return res.status(400).json({
			message:
				"We couldn't generate a short URL/QR code for you. Please try again later.",
		})
	}

	req.geo = geo
	req.originalIp = originalIp
	next()
}
