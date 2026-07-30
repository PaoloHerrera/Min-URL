export const SLUG_ERROR_CODES = {
	invalidSlug: 'INVALID_SLUG',
	slugNotFound: 'SLUG_NOT_FOUND',
	slugIsExpired: 'SLUG_IS_EXPIRED',
	slugIsDeleted: 'SLUG_IS_DELETED',
	slugGenerationExhausted: 'SLUG_GENERATION_EXHAUSTED',
} as const

export const API_ERROR_CODES = {
	invalidPayload: 'INVALID_PAYLOAD',
	invalidUrl: 'INVALID_URL',
	badRequest: 'BAD_REQUEST',
	internalServerError: 'INTERNAL_SERVER_ERROR',
} as const

export type SlugErrorCode =
	(typeof SLUG_ERROR_CODES)[keyof typeof SLUG_ERROR_CODES]

export type ApiErrorCode =
	(typeof API_ERROR_CODES)[keyof typeof API_ERROR_CODES]

export const INTERNAL_TOKEN_ERROR_MESSAGES = {
	missingHeader: 'Authorization header missing',
	invalidHeader: 'Invalid or malformed Authorization header',
} as const

export const INTERNAL_TOKEN_ERROR_RESPONSES = {
	missingHeader: { message: INTERNAL_TOKEN_ERROR_MESSAGES.missingHeader },
	invalidHeader: { message: INTERNAL_TOKEN_ERROR_MESSAGES.invalidHeader },
} as const
