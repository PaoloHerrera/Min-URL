import { describe, it, expect } from 'vitest'
import { resolveHttpStatusCode } from '../src/errors.ts'
import type { HttpErrorCodes } from '../src/errors.ts'

describe('Error HTTP Contract', () => {
	const cases = [
		{
			error: 'INVALID_SLUG',
			expected: 400,
		},
		{
			error: 'SLUG_NOT_FOUND',
			expected: 404,
		},
		{
			error: 'SLUG_IS_EXPIRED',
			expected: 410,
		},
		{
			error: 'SLUG_IS_DELETED',
			expected: 410,
		},
		{
			error: 'SLUG_GENERATION_EXHAUSTED',
			expected: 503,
		},
		{
			error: 'SLUG_ALREADY_EXISTS',
			expected: 409,
		},
		{
			error: 'INVALID_PAYLOAD',
			expected: 400,
		},
		{
			error: 'INVALID_URL',
			expected: 400,
		},
		{
			error: 'BAD_REQUEST',
			expected: 400,
		},
		{
			error: 'INTERNAL_SERVER_ERROR',
			expected: 500,
		},
		{
			error: 'TOO_MANY_REQUESTS',
			expected: 429,
		},
		{
			error: 'PAYLOAD_TOO_LARGE',
			expected: 413,
		},
		{
			error: 'INVALID_JSON',
			expected: 400,
		},
		{
			error: 'INVALID_CAPTCHA_TOKEN',
			expected: 422,
		},
		{
			error: 'CAPTCHA_SERVICE_ERROR',
			expected: 503,
		},
		{
			error: 'FORBIDDEN_EXTENSION',
			expected: 400,
		},
		{
			error: 'INVALID_PASSWORD',
			expected: 400,
		},
	] satisfies readonly {
		error: HttpErrorCodes
		expected: number
	}[]

	it.each(cases)(
		'Should return $expected status code for $error error',
		({ error, expected }) => {
			const result = resolveHttpStatusCode(error)
			expect(result).toBe(expected)
		},
	)
})
