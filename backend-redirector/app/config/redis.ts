import Redis from 'ioredis'
import { VITE_REDIS_URL, VITE_REDIS_PORT } from '~/constants'

interface ClickData {
	idUrl: string
	url: string
	slug: string
	ip: string
	userAgent: string | null
	referer: string | null
	deviceType: string | null
	timestamp: number
}

const redis = new Redis({
	port: Number(VITE_REDIS_PORT) || 6379,
	host: VITE_REDIS_URL || 'localhost',
})

export const publishClick = (data: ClickData) => {
	redis.publish(`click:${data.slug}`, JSON.stringify(data))
	console.log('Click publicado:', data)
}
