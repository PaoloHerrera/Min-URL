import geoip from 'geoip-lite'

// Función para obtener geolocalización
const getGeoLocation = (ip) => geoip.lookup(ip) || {}

export const verifyGeoIp = (req, res, next) => {
	// Capturamos la ip del usuario
	const originalIp =
		process.env.NODE_ENV === 'development' ? process.env.LOCAL_IP : req.ip
	const geo = getGeoLocation(originalIp)

	// Verifica si geo es vacío
	if (Object.keys(geo).length === 0) {
		return res.status(400).json({
			message:
				"We couldn't generate your QR Code at this time. Please try again later.",
		})
	}
	req.geo = geo
	req.originalIp = originalIp
	next()
}
