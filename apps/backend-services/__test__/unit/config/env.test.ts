import { describe, expect, it } from 'vitest'
import { parseEnv } from '@/config/env.ts'

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

	describe('ENABLE_SWAGGER boolean coercion', () => {
		it.each([
			{ input: 'false', expected: false },
			{ input: 'true', expected: true },
			{ input: undefined, expected: false },
		])('Should parse "$input" as $expected', ({ input, expected }) => {
			const parsed = parseEnv({ ...validBaseEnv, ENABLE_SWAGGER: input })
			expect(parsed.ENABLE_SWAGGER).toBe(expected)
		})
	})

	describe('PORT validation', () => {
		it('Should throw when PORT is empty string (Fail-Fast)', () => {
			expect(() => parseEnv({ ...validBaseEnv, PORT: '' })).toThrow()
		})

		it.each(['0', '70000'])(
			'Should throw when PORT is out of valid range (%s)',
			(port) => {
				expect(() => parseEnv({ ...validBaseEnv, PORT: port })).toThrow()
			},
		)
	})

	describe('Required fields Fail-Fast validation', () => {
		it.each([
			'DATABASE_URL',
			'ADMIN_URL',
			'TURNSTILE_SECRET_KEY',
			'INTERNAL_SECRET',
			'CORS_ALLOWED_ORIGINS',
		])('Should throw when %s is empty string', (field) => {
			expect(() => parseEnv({ ...validBaseEnv, [field]: '' })).toThrow()
		})
	})
})
