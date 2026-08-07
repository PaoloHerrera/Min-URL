import { describe, expect, it } from 'vitest'
import express from 'express'
import request from 'supertest'
import { corsMiddleware } from '@/adapters/primary/http/middlewares/cors.middleware.ts'

describe('corsMiddleware (Unit Test)', () => {
	let app: express.Express

	it('Should allow request and append header if origin is in the allowed list', async () => {
		app = express()

		const envAllowedOrigins = 'https://min-url.com,https://another.com'
		const allowedOrigins = envAllowedOrigins.split(',')

		app.use(corsMiddleware(allowedOrigins))
		app.get('/test', (_req, res) => {
			res.status(200).send('ok')
		})
		const response = await request(app)
			.get('/test')
			.set('Origin', 'https://min-url.com')

		expect(response.status).toBe(200)
		expect(response.headers['access-control-allow-origin']).toBe(
			'https://min-url.com',
		)
	})

	it('Should deny request (throw error) if origin is not allowed', async () => {
		app = express()

		const envAllowedOrigins = 'https://min-url.com,https://another.com'
		const allowedOrigins = envAllowedOrigins.split(',')

		app.use(corsMiddleware(allowedOrigins))
		const response = await request(app)
			.get('/test')
			.set('Origin', 'https://denied.com')

		expect(response.status).toBe(500)
		expect(response.headers['access-control-allow-origin']).toBeUndefined()
	})
})
