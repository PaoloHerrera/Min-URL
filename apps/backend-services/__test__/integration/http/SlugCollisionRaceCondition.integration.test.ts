/**
 * 🧪 CONCURRENT SLUG COLLISION RESILIENCE TEST (TOCTOU RACE CONDITION - ISSUE #35)
 *
 * 📌 ARCHITECTURAL CONTEXT & TEST HARNESS EXPLANATION:
 * In production, due to SHA-256 hash truncation to 6 Base62 characters (62^6 ≈ 56.8 billion combinations),
 * two concurrent HTTP requests entering in the exact same millisecond with different URLs and UUIDs can derive
 * the SAME initial 6-character candidate slug by statistical probability (Birthday Paradox / Hash Prefix Collision).
 *
 * 🧪 DETERMINISTIC LABORATORY TECHNIQUE:
 * To avoid running 50 billion random requests in CI, we use `vi.spyOn(globalThis.crypto, 'randomUUID')`
 * as a deterministic laboratory test harness:
 * 1. Request A and Attempt 1 of Request B receive the same seed ('...0001'), forcing both to derive candidate slug ('h7vAH1').
 * 2. Both requests execute `isSlugAvailable('h7vAH1')` in parallel and both receive `true` (Time-of-Check to Time-of-Use scenario).
 * 3. Request A completes PostgreSQL insertion successfully.
 * 4. Request B attempts to insert 'h7vAH1' and PostgreSQL rejects with unique constraint exception 23505 (unique_violation).
 * 5. Attempt 2 of Request B receives fresh seed ('...0002') during transparent retry.
 *
 * 🎯 DESIRED BUSINESS ASSERTION:
 * Both concurrent requests must recover cleanly, respond with HTTP 200, and return unique different slugs.
 */

import request from 'supertest'
import { describe, expect, it, vi, beforeAll, afterAll } from 'vitest'
import { DrizzleShortUrlRepository } from '@/adapters/secondary/db/DrizzleShortUrlRepository.ts'
import { SlugAlreadyExistsError } from '@/core/domain/errors/domain.errors.ts'
import { createTestApp } from '../helpers/createTestApp.ts'

vi.mock('@/adapters/secondary/captcha/TurnstileCaptchaService.ts', () => ({
	TurnstileCaptchaService: class {
		verify = vi.fn().mockResolvedValue(true)
	},
}))

let app: ReturnType<typeof createTestApp>['app']
let db: ReturnType<typeof createTestApp>['db']

beforeAll(() => {
	const testApp = createTestApp()
	app = testApp.app
	db = testApp.db
})

afterAll(() => {
	db.close()
})

describe('POST /direct/shorten - Concurrent Slug Collision Resilience', () => {
	const { app } = createTestApp()

	it('Should successfully create unique short URLs with HTTP 200 for concurrent requests even if initial candidate slugs collide', async () => {
		// 1. Spy on crypto.randomUUID (Deterministic laboratory test harness)
		const spy = vi.spyOn(globalThis.crypto, 'randomUUID')

		// Force Request A and Request B to attempt the same initial UUID/slug
		// Request A attempt 1
		spy.mockReturnValueOnce('00000000-0000-0000-0000-000000000001')
		// Request B attempt 1 (Collides with Request A)
		spy.mockReturnValueOnce('00000000-0000-0000-0000-000000000001')
		// Request B attempt 2 (Transparent retry with new UUID)
		spy.mockReturnValueOnce('00000000-0000-0000-0000-000000000002')

		// 2. Execute two concurrent requests in parallel
		const [resA, resB] = await Promise.all([
			request(app).post('/direct/shorten').send({
				originalUrl: 'https://www.google.com',
				captchaToken: 'fake-token',
			}),
			request(app).post('/direct/shorten').send({
				originalUrl: 'https://www.google.com',
				captchaToken: 'fake-token',
			}),
		])

		// 3. Business Desired Behavior Assertions (Both succeed with HTTP 200 and different unique slugs)
		expect(resA.status).toBe(200)
		expect(resB.status).toBe(200)

		expect(resA.body).toHaveProperty('slug')
		expect(resB.body).toHaveProperty('slug')

		expect(resA.body.slug).not.toEqual(resB.body.slug)
	})

	it('Should return HTTP 409 Conflict when all retries continuously suffer slug collisions', async () => {
		// 1. Spy on DrizzleShortUrlRepository.prototype.save to continuously throw SlugAlreadyExistsError
		vi.spyOn(DrizzleShortUrlRepository.prototype, 'save').mockRejectedValue(
			new SlugAlreadyExistsError(),
		)

		// 2. Send HTTP request
		const response = await request(app).post('/direct/shorten').send({
			originalUrl: 'https://www.google.com',
			captchaToken: 'fake-token',
		})

		// 3. Assert HTTP 409 Conflict with SLUG_ALREADY_EXISTS payload
		expect(response.status).toBe(409)
		expect(response.body).toHaveProperty('code', 'SLUG_ALREADY_EXISTS')
	})
})
