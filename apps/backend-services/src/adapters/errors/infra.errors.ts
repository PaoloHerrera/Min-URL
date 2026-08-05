import type {
	InfraErrorCode,
	SecurityErrorCode,
} from '@min-url/contracts/errors'
import { INFRA_ERROR, SECURITY_ERROR } from '@min-url/contracts/errors'

export abstract class InfraError extends Error {
	abstract readonly code: InfraErrorCode | SecurityErrorCode

	constructor(message: string) {
		super(message)
		this.name = this.constructor.name
		Object.setPrototypeOf(this, new.target.prototype)
	}
}

export class PayloadTooLargeError extends InfraError {
	readonly code = SECURITY_ERROR.payloadTooLarge.code
	constructor() {
		super(SECURITY_ERROR.payloadTooLarge.message)
	}
}

export class TooManyRequestsError extends InfraError {
	readonly code = SECURITY_ERROR.tooManyRequests.code

	constructor() {
		super(SECURITY_ERROR.tooManyRequests.message)
	}
}

export class InvalidJsonError extends InfraError {
	readonly code = SECURITY_ERROR.invalidJson.code
	constructor() {
		super(SECURITY_ERROR.invalidJson.message)
	}
}

export class InvalidPayloadError extends InfraError {
	readonly code = SECURITY_ERROR.invalidPayload.code
	constructor(message?: string) {
		super(message || SECURITY_ERROR.invalidPayload.message)
	}
}

export class CaptchaServiceError extends InfraError {
	readonly code = INFRA_ERROR.captchaServiceError.code
	constructor() {
		super(INFRA_ERROR.captchaServiceError.message)
	}
}

export class BadRequestError extends InfraError {
	readonly code = INFRA_ERROR.badRequest.code
	constructor() {
		super(INFRA_ERROR.badRequest.message)
	}
}

export class InternalServerError extends InfraError {
	readonly code = INFRA_ERROR.internalServerError.code
	constructor() {
		super(INFRA_ERROR.internalServerError.message)
	}
}
