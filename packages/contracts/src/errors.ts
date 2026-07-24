export const SLUG_ERROR_CODES = {
	slugNotFound: 'SLUG_NOT_FOUND',
	slugIsExpired: 'SLUG_IS_EXPIRED',
	slugIsDeleted: 'SLUG_IS_DELETED',
	slugGenerationExhausted: 'SLUG_GENERATION_EXHAUSTED',
	invalidUrl: 'INVALID_URL',
} as const

export type SlugErrorCode =
	(typeof SLUG_ERROR_CODES)[keyof typeof SLUG_ERROR_CODES]
