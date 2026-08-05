import { SECURITY_ERROR } from '@min-url/contracts/errors'

export abstract class ApplicationError extends Error {
	abstract readonly code: string

	constructor(message: string) {
		super(message)
		this.name = this.constructor.name
		Object.setPrototypeOf(this, new.target.prototype)
	}
}

export class CaptchaVerificationError extends ApplicationError {
	readonly code = SECURITY_ERROR.invalidCaptchaToken.code
	constructor() {
		super(SECURITY_ERROR.invalidCaptchaToken.message)
	}
}
