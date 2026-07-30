import { describe, expect, it } from 'vitest'
import { envSchema } from '@/config/env.ts'

describe('Environment Config Schema (Unit Test)', () => {
	const validBaseEnv = {
		PORT: '3001',
		NODE_ENV: 'test',
		REDIRECTOR_URL: 'http://localhost:3002',
		DATABASE_URL: 'postgres://admin:admin@localhost:5432/min_url_test',
		ADMIN_URL: 'postgres://admin:admin@localhost:5432/postgres',
		TURNSTILE_SECRET_KEY: 'test-secret-key',
		INTERNAL_SECRET: 'ci_test_internal_secret_32_characters_min',
		CORS_ALLOWED_ORIGINS: 'http://localhost:4321',
	}

	it('Should parse ENABLE_SWAGGER as false when string "false" is provided', () => {
		const parsed = envSchema.parse({
			...validBaseEnv,
			ENABLE_SWAGGER: 'false',
		})

		expect(parsed.ENABLE_SWAGGER).toBe(false)
	})

	it('Should parse ENABLE_SWAGGER as true when string "true" is provided', () => {
		const parsed = envSchema.parse({
			...validBaseEnv,
			ENABLE_SWAGGER: 'true',
		})

		expect(parsed.ENABLE_SWAGGER).toBe(true)
	})

	it('Should default ENABLE_SWAGGER to false when undefined', () => {
		const parsed = envSchema.parse({
			...validBaseEnv,
		})

		expect(parsed.ENABLE_SWAGGER).toBe(false)
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
