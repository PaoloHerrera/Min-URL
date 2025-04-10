import {
	createGeolocation,
	getGeolocationByIp,
} from '../models/GeolocationModel.js'
import geoip from 'geoip-lite'
import geoipCountry from 'geoip-country'

const createGeolocationService = async (ipAddress) => {
	// Se busca la geolocalización del IP
	const geo = lookupGeolocation(ipAddress)
	// Si no se encuentra la geolocalización, se inserta como "unknown"
	const geolocation = await createGeolocation({
		// biome-ignore lint/style/useNamingConvention: Sequelize need use snake case
		ip_address: ipAddress,
		country: geo.country || 'unknown',
		region: geo.region || 'unknown',
		timezone: geo.timezone || null,
		city: geo.city || 'unknown',
		latitude: geo?.ll?.[0]?.toString() ?? null,
		longitude: geo?.ll?.[1]?.toString() ?? null,
	})
	return geolocation
}

const lookupGeolocation = (ip) => {
	if (ip === 'unknown' || ip === null || ip === undefined || ip === '') {
		return {}
	}

	const geo = geoip.lookup(ip)
	const geoCountry = geoipCountry.lookup(ip)

	return {
		...geo,
		country: geoCountry?.name,
	}
}

export const getOrcreateGeolocation = async (ip) => {
	let geolocation = await getGeolocationByIp(ip)
	if (!geolocation) {
		geolocation = await createGeolocationService(ip)
	}
	return geolocation
}
