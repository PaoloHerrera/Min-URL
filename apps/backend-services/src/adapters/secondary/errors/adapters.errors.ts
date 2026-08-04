export class AdaptersError extends Error {
	readonly code: string

	constructor(message: string, code: string) {
		super(message)
		this.code = code
		this.name = this.constructor.name
		Object.setPrototypeOf(this, new.target.prototype)
	}
}

export class CaptchaServiceError extends AdaptersError {
	constructor() {
		super(
			'Error to connect with the CAPTCHA service. Please try again later.',
			'CAPTCHA_SERVICE_ERROR',
		)
	}
}
