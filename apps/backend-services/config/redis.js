import Redis from 'ioredis'
import { SequelizeGeolocationService } from '../src/adapters/secondary/db/SequelizeGeolocationService.js'
import { createClickDetail } from '../src/adapters/secondary/db/models/clickDetailModel.js'
import { createClick } from '../src/adapters/secondary/db/models/clickModel.js'

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
		const geolocationService = new SequelizeGeolocationService()
		const { id_geolocations } = await geolocationService.getOrCreate(ip)
		idGeolocation = id_geolocations

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
