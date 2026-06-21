import Redis from 'ioredis'
import { createClickDetail } from '../models/clickDetailModel.js'
import { createClick } from '../models/clickModel.js'
import { getGeolocationByIp } from '../models/geolocationModel.js'
import { createGeolocation } from '../models/geolocationModel.js'
import { lookupGeolocation } from '../utils/geo.js'

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
			click_id: id_clicks,
			geolocations_id: idGeolocation,
			user_agent: userAgent,
			device_type: deviceType,
			referer: referer,
		})
	})
}
