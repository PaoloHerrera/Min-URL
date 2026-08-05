import { describe, it, expect } from 'vitest'
import { resolveHttpStatusCode } from '../src/errors.ts'
import type { HttpErrorCodes } from '../src/errors.ts'

describe('Error HTTP Contract', () => {
	it.each([
		{ error: 'INVALID_SLUG' as HttpErrorCodes, expected: 400 },
		{ error: 'SLUG_NOT_FOUND' as HttpErrorCodes, expected: 404 },
		{ error: 'SLUG_IS_EXPIRED' as HttpErrorCodes, expected: 410 },
		{ error: 'SLUG_IS_DELETED' as HttpErrorCodes, expected: 410 },
		{ error: 'SLUG_GENERATION_EXHAUSTED' as HttpErrorCodes, expected: 503 },
		{ error: 'SLUG_ALREADY_EXISTS' as HttpErrorCodes, expected: 409 },
		{ error: 'INVALID_PAYLOAD' as HttpErrorCodes, expected: 400 },
		{ error: 'INVALID_URL' as HttpErrorCodes, expected: 400 },
		{ error: 'BAD_REQUEST' as HttpErrorCodes, expected: 400 },
		{ error: 'INTERNAL_SERVER_ERROR' as HttpErrorCodes, expected: 500 },
		{ error: 'TOO_MANY_REQUESTS' as HttpErrorCodes, expected: 429 },
		{ error: 'PAYLOAD_TOO_LARGE' as HttpErrorCodes, expected: 413 },
		{ error: 'INVALID_JSON' as HttpErrorCodes, expected: 400 },
		{ error: 'INVALID_CAPTCHA_TOKEN' as HttpErrorCodes, expected: 422 },
		{ error: 'CAPTCHA_SERVICE_ERROR' as HttpErrorCodes, expected: 503 },
	])(
		'Should return $expected status code for $error error',
		({ error, expected }) => {
			const result = resolveHttpStatusCode(error)
			expect(result).toBe(expected)
		},
	)
})
