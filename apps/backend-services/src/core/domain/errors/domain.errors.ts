import { API_ERROR_CODES, SLUG_ERROR_CODES } from '@min-url/contracts/errors'

export class DomainError extends Error {
	readonly code: string = API_ERROR_CODES.badRequest
	readonly statusCode: number = 400

	constructor(message: string, statusCode?: number) {
		super(message)
		this.statusCode = statusCode || this.statusCode
		this.name = this.constructor.name
		Object.setPrototypeOf(this, new.target.prototype)
	}
}

export class InvalidUrlError extends DomainError {
	readonly code = API_ERROR_CODES.invalidUrl
	constructor(url: string) {
		super(`Invalid URL: ${url}`, 400)
	}
}

export class InvalidSlugError extends DomainError {
	readonly code = SLUG_ERROR_CODES.invalidSlug
	constructor(slug: string) {
		super(`Invalid slug: ${slug}`)
	}
}

export class InvalidIpAddressError extends DomainError {
	readonly code = 'INVALID_IP_ADDRESS'
	constructor(ip: string) {
		super(`Invalid IP address: ${ip}`)
	}
}

export class InvalidPasswordError extends DomainError {
	readonly code = 'INVALID_PASSWORD'
	constructor() {
		super('Invalid password')
	}
}

export class InvalidGeolocationError extends DomainError {
	readonly code = 'INVALID_GEOLOCATION'
	constructor(message: string) {
		super(`${message}`)
	}
}

export class InvalidVisitError extends DomainError {
	readonly code = 'INVALID_VISIT'
}

export class ForbiddenExtensionError extends DomainError {
	readonly code = 'FORBIDDEN_EXTENSION'
	constructor(url: string) {
		super(`URL contains a forbidden file extension: ${url}`)
	}
}

export class CaptchaVerificationError extends DomainError {
	readonly code = 'CAPTCHA_VERIFICATION_FAILED'
	constructor() {
		super('Invalid captcha token')
	}
}

export class SlugGenerationExhaustedError extends DomainError {
	readonly code = SLUG_ERROR_CODES.slugGenerationExhausted
	constructor() {
		super('Error creating Short URL. Please try again later.', 503)
	}
}

export class SlugNotFoundError extends DomainError {
	readonly code = SLUG_ERROR_CODES.slugNotFound
	constructor(slug: string) {
		super(`Slug not found: ${slug}`, 404)
	}
}

export class SlugIsExpiredError extends DomainError {
	readonly code = SLUG_ERROR_CODES.slugIsExpired
	constructor(slug: string) {
		super(`Slug is expired: ${slug}`, 410)
	}
}

export class SlugIsDeletedError extends DomainError {
	readonly code = SLUG_ERROR_CODES.slugIsDeleted
	constructor(slug: string) {
		super(`Slug is deleted: ${slug}`, 410)
	}
}

export class SlugAlreadyExistsError extends DomainError {
	readonly code = SLUG_ERROR_CODES.slugAlreadyExists
	constructor(slug: string) {
		super(`The short URL slug '${slug}' is already taken.`, 409)
	}
}

export class TooManyRequestsError extends DomainError {
	readonly code = API_ERROR_CODES.tooManyRequests
	constructor(message = 'Too many requests, please try again later.') {
		super(message, 429)
	}
}
