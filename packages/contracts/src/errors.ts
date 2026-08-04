export const SLUG_ERROR_CODES = {
	invalidSlug: 'INVALID_SLUG',
	slugNotFound: 'SLUG_NOT_FOUND',
	slugIsExpired: 'SLUG_IS_EXPIRED',
	slugIsDeleted: 'SLUG_IS_DELETED',
	slugGenerationExhausted: 'SLUG_GENERATION_EXHAUSTED',
	slugAlreadyExists: 'SLUG_ALREADY_EXISTS',
} as const

export const API_ERROR_CODES = {
	invalidPayload: 'INVALID_PAYLOAD',
	invalidUrl: 'INVALID_URL',
	badRequest: 'BAD_REQUEST',
	internalServerError: 'INTERNAL_SERVER_ERROR',
	tooManyRequests: 'TOO_MANY_REQUESTS',
} as const

export const HTTP_ERROR_CODES = {
	payloadTooLarge: {
		code: 'PAYLOAD_TOO_LARGE',
		message: 'Payload is too large',
		statusCode: 413,
	},
	invalidJson: {
		code: 'INVALID_JSON',
		message: 'Invalid JSON',
		statusCode: 400,
	},
} as const

export type SlugErrorCode =
	(typeof SLUG_ERROR_CODES)[keyof typeof SLUG_ERROR_CODES]

export type ApiErrorCode =
	(typeof API_ERROR_CODES)[keyof typeof API_ERROR_CODES]

export type HttpErrorCode =
	(typeof HTTP_ERROR_CODES)[keyof typeof HTTP_ERROR_CODES]['code']

export const INTERNAL_TOKEN_ERROR_MESSAGES = {
	missingHeader: 'Authorization header missing',
	invalidHeader: 'Invalid or malformed Authorization header',
} as const

export const INTERNAL_TOKEN_ERROR_RESPONSES = {
	missingHeader: { message: INTERNAL_TOKEN_ERROR_MESSAGES.missingHeader },
	invalidHeader: { message: INTERNAL_TOKEN_ERROR_MESSAGES.invalidHeader },
} as const
