import { API_ERROR_CODES } from '@min-url/contracts/errors'

export class ApplicationError extends Error {
	readonly code: string = API_ERROR_CODES.badRequest

	constructor(message: string) {
		super(message)
		this.name = this.constructor.name
		Object.setPrototypeOf(this, new.target.prototype)
	}
}

export class CaptchaVerificationError extends ApplicationError {
	readonly code = 'INVALID_CAPTCHA_TOKEN'
	constructor() {
		super('Invalid captcha token. Please try again.')
	}
}
