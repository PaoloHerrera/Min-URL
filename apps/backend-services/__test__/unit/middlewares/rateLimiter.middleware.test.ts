import { describe, it, expect } from 'vitest'
import express from 'express'
import request from 'supertest'
import { rateLimiter } from '@/adapters/primary/http/middlewares/rateLimiter.middleware.ts'
import { errorHandler } from '@/adapters/primary/http/middlewares/errorHandler.middleware.ts'
import { SECURITY_ERROR } from '@min-url/contracts/errors'

describe('Rate Limiter Middleware', () => {
	const config = {
		enabled: true,
		windowMs: 100,
		maxRequests: 10,
	}

	const createTestApp = (limiterConfig: {
		enabled: boolean
		windowMs: number
		maxRequests: number
	}) => {
		const testApp = express()
		testApp.set('trust proxy', 1)
		testApp.use(rateLimiter(limiterConfig))
		testApp.get('/test', (_req, res) => {
			res.status(200).json({ ok: true })
		})
		testApp.use(errorHandler)
		return testApp
	}

	const sendBurstRequests = async (
		expressApp: express.Express,
		count: number,
		ip = '216.211.105.89',
		endpoint = '/test',
	) => {
		const promises = Array.from({ length: count }, () =>
			request(expressApp).get(endpoint).set('X-Forwarded-For', ip),
		)
		return await Promise.all(promises)
	}

	it('Should return 429 when max request limit is reached for the same IP within window', async () => {
		const app = createTestApp(config)
		const results = await sendBurstRequests(app, 11)

		const success = results.filter((r) => r.status === 200)
		const failed = results.filter((r) => r.status === 429)

		expect(success.length).toBe(10)
		expect(failed.length).toBe(1)
		expect(failed[0].body).toEqual({
			code: SECURITY_ERROR.tooManyRequests.code,
			message: SECURITY_ERROR.tooManyRequests.message,
		})
		expect(failed[0].headers['ratelimit-limit']).toBe('10')
		expect(failed[0].headers['ratelimit-remaining']).toBe('0')
		expect(failed[0].headers['ratelimit-reset']).toBeDefined()
	})

	it('Should return 200 when requests are not exceeding the max request limit', async () => {
		const app = createTestApp(config)
		const results = await sendBurstRequests(app, 10)

		const success = results.filter((r) => r.status === 200)
		const failed = results.filter((r) => r.status === 429)

		expect(success.length).toBe(10)
		expect(failed.length).toBe(0)
	})

	it('Should return 200 when rate limiter is not enabled', async () => {
		const { enabled, ...restConfig } = config
		const app = createTestApp({ enabled: false, ...restConfig })
		const results = await sendBurstRequests(app, 11)

		const success = results.filter((r) => r.status === 200)
		const failed = results.filter((r) => r.status === 429)

		expect(success.length).toBe(11)
		expect(failed.length).toBe(0)
	})

	it('Should return 200 when the window time has passed and the request limit is reset', async () => {
		const app = createTestApp(config)
		const results = await sendBurstRequests(app, 11)

		const success = results.filter((r) => r.status === 200)
		const failed = results.filter((r) => r.status === 429)

		expect(success.length).toBe(10)
		expect(failed.length).toBe(1)
		expect(failed[0].status).toBe(429)

		// Wait for window to reset
		await new Promise((resolve) => setTimeout(resolve, config.windowMs + 10))

		const response = await request(app)
			.get('/test')
			.set('X-Forwarded-For', '216.211.105.89')

		expect(response.status).toBe(200)
	})

	it('Should isolate limits per IP address so requests from different IPs do not block each other', async () => {
		const app = createTestApp(config)
		const results1 = await sendBurstRequests(app, 13, '216.211.105.89')

		const success1 = results1.filter((r) => r.status === 200)
		const failed1 = results1.filter((r) => r.status === 429)

		expect(success1.length).toBe(10)
		expect(failed1.length).toBe(3)
		expect(failed1[0].status).toBe(429)

		const response2 = await request(app)
			.get('/test')
			.set('X-Forwarded-For', '216.211.105.99')

		expect(response2.status).toBe(200)
	})
})
