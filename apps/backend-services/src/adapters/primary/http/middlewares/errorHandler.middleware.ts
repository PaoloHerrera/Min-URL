import { DomainError } from '@/core/domain/errors/domain.errors.ts'
import type { ErrorResponsePayload } from '@min-url/contracts/dto'
import { API_ERROR_CODES } from '@min-url/contracts/errors'
import type { NextFunction, Request, Response } from 'express'
import { HttpError } from '../errors/http.errors.ts'

export const errorHandler = (
	error: Error,
	_req: Request,
	res: Response,
	_next: NextFunction,
): void => {
	if (error instanceof DomainError) {
		const payload: ErrorResponsePayload = {
			code: error.code || API_ERROR_CODES.badRequest,
			message: error.message,
		}

		res.status(error.statusCode).json(payload)
		return
	}

	if (error instanceof HttpError) {
		const payload: ErrorResponsePayload = {
			code: error.code,
			message: error.message,
		}

		res.status(error.statusCode).json(payload)
		return
	}

	console.error('Unhandled Server Error:', error)
	const internalPayload: ErrorResponsePayload = {
		code: API_ERROR_CODES.internalServerError,
		message: 'An unexpected internal server error occurred.',
	}
	res.status(500).json(internalPayload)
}
