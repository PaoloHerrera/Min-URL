export const SLUG_ERROR = {
	invalidSlug: {
		code: 'INVALID_SLUG',
		message:
			'Slug must be between 6 and 12 characters long and can only contain alphanumeric characters.',
	},
	slugNotFound: {
		code: 'SLUG_NOT_FOUND',
		message: 'The requested slug does not exist or has been deleted.',
	},
	slugIsExpired: {
		code: 'SLUG_IS_EXPIRED',
		message: 'The requested slug has expired.',
	},
	slugIsDeleted: {
		code: 'SLUG_IS_DELETED',
		message: 'The requested slug does not exist or has been deleted.',
	},
	slugGenerationExhausted: {
		code: 'SLUG_GENERATION_EXHAUSTED',
		message:
			'The system is currently unable to generate short URLs. Please try again later.',
	},
	slugAlreadyExists: {
		code: 'SLUG_ALREADY_EXISTS',
		message: 'The slug already exists. Please choose a different one.',
	},
} as const

export const VALIDATION_ERROR = {
	invalidUrl: {
		code: 'INVALID_URL',
		message:
			'The URL provided is not valid. Please check the URL and try again.',
	},
	forbiddenExtension: {
		code: 'FORBIDDEN_EXTENSION',
		message:
			'The URL contains a forbidden file extension. Please check the URL and try again.',
	},
	invalidVisit: {
		code: 'INVALID_VISIT',
		message: 'Invalid visit entity parameters.',
	},
	invalidGeolocation: {
		code: 'INVALID_GEOLOCATION',
		message: 'Invalid geolocation coordinates format.',
	},
} as const

export const SECURITY_ERROR = {
	invalidCaptchaToken: {
		code: 'INVALID_CAPTCHA_TOKEN',
		message: 'Invalid captcha token. Please try again.',
	},
	tooManyRequests: {
		code: 'TOO_MANY_REQUESTS',
		message: 'Too many requests. Please try again later.',
	},
	payloadTooLarge: {
		code: 'PAYLOAD_TOO_LARGE',
		message:
			'The provided payload is too large. Please check the payload and try again.',
	},
	invalidPayload: {
		code: 'INVALID_PAYLOAD',
		message:
			'The provided payload is invalid. Please ensure all required fields are present.',
	},
	invalidJson: {
		code: 'INVALID_JSON',
		message:
			'The request body contains invalid JSON. Please check the JSON and try again.',
	},
} as const

export const INFRA_ERROR = {
	badRequest: {
		code: 'BAD_REQUEST',
		message: 'The request was invalid. Please check the request and try again.',
	},
	internalServerError: {
		code: 'INTERNAL_SERVER_ERROR',
		message: 'The server encountered an error. Please try again later.',
	},
	captchaServiceError: {
		code: 'CAPTCHA_SERVICE_ERROR',
		message:
			'Captcha service is currently unavailable. Please try again later.',
	},
} as const

type ValueOf<T> = T[keyof T]

export type SlugErrorCode = ValueOf<typeof SLUG_ERROR>['code']
export type ValidationErrorCode = ValueOf<typeof VALIDATION_ERROR>['code']
export type SecurityErrorCode = ValueOf<typeof SECURITY_ERROR>['code']
export type InfraErrorCode = ValueOf<typeof INFRA_ERROR>['code']

export type ErrorCodes =
	| SlugErrorCode
	| ValidationErrorCode
	| SecurityErrorCode
	| InfraErrorCode

export type HttpErrorCodes =
	| SlugErrorCode
	| Exclude<ValidationErrorCode, 'INVALID_VISIT' | 'INVALID_GEOLOCATION'>
	| SecurityErrorCode
	| InfraErrorCode

export type DomainErrorCodes = SlugErrorCode | ValidationErrorCode

export const INTERNAL_TOKEN_ERROR_MESSAGES = {
	missingHeader: 'Authorization header missing',
	invalidHeader: 'Invalid or malformed Authorization header',
} as const

export const INTERNAL_TOKEN_ERROR_RESPONSES = {
	missingHeader: { message: INTERNAL_TOKEN_ERROR_MESSAGES.missingHeader },
	invalidHeader: { message: INTERNAL_TOKEN_ERROR_MESSAGES.invalidHeader },
} as const

const ERROR_CODE_TO_HTTP_STATUS = {
	[SLUG_ERROR.invalidSlug.code]: 400,
	[SLUG_ERROR.slugNotFound.code]: 404,
	[SLUG_ERROR.slugIsExpired.code]: 410,
	[SLUG_ERROR.slugIsDeleted.code]: 410,
	[SLUG_ERROR.slugGenerationExhausted.code]: 503,
	[SLUG_ERROR.slugAlreadyExists.code]: 409,
	[VALIDATION_ERROR.invalidUrl.code]: 400,
	[VALIDATION_ERROR.forbiddenExtension.code]: 400,
	[SECURITY_ERROR.invalidPayload.code]: 400,
	[SECURITY_ERROR.invalidJson.code]: 400,
	[SECURITY_ERROR.invalidCaptchaToken.code]: 422,
	[SECURITY_ERROR.tooManyRequests.code]: 429,
	[SECURITY_ERROR.payloadTooLarge.code]: 413,
	[INFRA_ERROR.badRequest.code]: 400,
	[INFRA_ERROR.internalServerError.code]: 500,
	[INFRA_ERROR.captchaServiceError.code]: 503,
} satisfies Record<HttpErrorCodes, number>

export const resolveHttpStatusCode = (
	code?: string,
	fallback = 400,
): number => {
	if (!code) {
		return fallback
	}
	return ERROR_CODE_TO_HTTP_STATUS[code as HttpErrorCodes] ?? fallback
}
