import { describe, expect, it } from 'vitest'
import { envSchema } from '../../../src/config/env.ts'

describe('Backend Redirector Environment Schema (Unit Test)', () => {
	const validBaseEnv = {
		NODE_ENV: 'test',
		FRONTEND_URL: 'http://localhost:4321',
		BACKEND_API_URL: 'http://localhost:3001',
		INTERNAL_SECRET:
			'8fd3144a74886b7301972a074d1d286ea841974680138055d99c5182149b311d',
	}

	it('Should fallback to default port 3002 when PORT is undefined', () => {
		const parsed = envSchema.parse({
			...validBaseEnv,
		})

		expect(parsed.PORT).toBe(3002)
	})

	it('Should parse valid integer string PORT correctly', () => {
		const parsed = envSchema.parse({
			...validBaseEnv,
			PORT: '8080',
		})

		expect(parsed.PORT).toBe(8080)
	})

	it('Should throw validation error when PORT is empty string (Fail-Fast)', () => {
		expect(() =>
			envSchema.parse({
				...validBaseEnv,
				PORT: '',
			}),
		).toThrow()
	})

	it('Should throw validation error when PORT is out of valid range (0 or > 65535)', () => {
		expect(() =>
			envSchema.parse({
				...validBaseEnv,
				PORT: '0',
			}),
		).toThrow()

		expect(() =>
			envSchema.parse({
				...validBaseEnv,
				PORT: '70000',
			}),
		).toThrow()
	})
})
