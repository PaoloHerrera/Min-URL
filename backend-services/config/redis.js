import Redis from 'ioredis'
import { lookupGeolocation } from '../utils/geo.js'
import { getGeolocationByIp } from '../models/GeolocationModel.js'
import { createGeolocation } from '../models/GeolocationModel.js'
import { createClick } from '../models/ClickModel.js'
import { createClickDetail } from '../models/ClickDetailModel.js'

const redis = new Redis({
	port: Number(process.env.REDIS_PORT),
	host: process.env.REDIS_URL,
})

export const setupRedis = () => {
	//Suscribirse a REDIS
	redis.psubscribe('click:*', (err) => {
		if (err) {
			console.log('Error suscribiendo a REDIS', err)
		}
	})

	//Escuchar los mensajes
	redis.on('pmessage', async (_pattern, _channel, message) => {
		let idGeolocation = null
		const data = JSON.parse(message)
		const { idUrl, ip, userAgent, deviceType, referer } = data
		console.log('Mensaje recibido:', data)

		//Crear click en la tabla de clicks
		const { id_clicks } = await createClick({
			// biome-ignore lint/style/useNamingConvention: Sequelize need use snake case
			url_id: idUrl,
		})

		// Verifica si la ip del cliente está en la tabla de geolocations. Si no está, crea una nueva geolocation
		const geolocation = await getGeolocationByIp(data.ip)
		if (geolocation) {
			idGeolocation = geolocation.id_geolocations
		} else {
			const geo = lookupGeolocation(data.ip)
			const { country, region, city, latitude, longitude } = geo
			const { id_geolocations } = await createGeolocation({
				// biome-ignore lint/style/useNamingConvention: Sequelize need use snake case
				ip_address: ip,
				country,
				region,
				city,
				latitude,
				longitude,
			})
			idGeolocation = id_geolocations
		}

		//Crear click detalles en la tabla de clicks_details
		await createClickDetail({
			// biome-ignore lint/style/useNamingConvention: Sequelize need use snake case
			click_id: id_clicks,
			// biome-ignore lint/style/useNamingConvention: Sequelize need use snake case
			geolocations_id: idGeolocation,
			// biome-ignore lint/style/useNamingConvention: Sequelize need use snake case
			user_agent: userAgent,
			// biome-ignore lint/style/useNamingConvention: Sequelize need use snake case
			device_type: deviceType,
			referer: referer,
		})
	})
}
