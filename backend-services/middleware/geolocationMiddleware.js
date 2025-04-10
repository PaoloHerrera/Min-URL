import { getOrcreateGeolocation } from '../services/GeolocationServices.js'

export const addGeolocation = async (req, _res, next) => {
	const ip =
		req.body.ip ||
		req.headers['x-forwarded-for'] ||
		req.connection.remoteAddress ||
		'unknown'

	req.geolocation = await getOrcreateGeolocation(ip)
	next()
}
