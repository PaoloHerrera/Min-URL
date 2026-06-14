import geoipCountry from 'geoip-country'
import geoip from 'geoip-lite'

// Función para obtener geolocalización

export const lookupGeolocation = (ip) => {
	if (!ip) {
		return {}
	}

	const geo = geoip.lookup(ip)
	const geoCountry = geoipCountry.lookup(ip)

	return {
		...geo,
		country: geoCountry?.name,
	}
}
