export class DomainError extends Error {
	constructor(message: string) {
		super(message)
		this.name = this.constructor.name
		Object.setPrototypeOf(this, new.target.prototype)
	}
}

export class InvalidUrlError extends DomainError {
	readonly code = 'INVALID_URL'
	constructor(url: string) {
		super(`Invalid URL: ${url}`)
	}
}

export class InvalidSlugError extends DomainError {
	readonly code = 'INVALID_SLUG'
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
	readonly code = 'SLUG_GENERATION_EXHAUSTED'
	constructor() {
		super('Error creating Short URL. Please try again later.')
	}
}
