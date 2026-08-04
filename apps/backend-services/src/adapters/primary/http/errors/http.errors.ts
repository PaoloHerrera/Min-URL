import { HTTP_ERROR_CODES } from '@min-url/contracts/errors'

export class HttpError extends Error {
	readonly code: Readonly<string>
	readonly statusCode: Readonly<number>

	constructor(message: string, code: string, statusCode: number) {
		super(message)
		this.code = code
		this.statusCode = statusCode
	}
}

export class PayloadTooLargeError extends HttpError {
	constructor() {
		super(
			HTTP_ERROR_CODES.payloadTooLarge.message,
			HTTP_ERROR_CODES.payloadTooLarge.code,
			HTTP_ERROR_CODES.payloadTooLarge.statusCode,
		)
	}
}

export class InvalidJsonError extends HttpError {
	constructor() {
		super(
			HTTP_ERROR_CODES.invalidJson.message,
			HTTP_ERROR_CODES.invalidJson.code,
			HTTP_ERROR_CODES.invalidJson.statusCode,
		)
	}
}
