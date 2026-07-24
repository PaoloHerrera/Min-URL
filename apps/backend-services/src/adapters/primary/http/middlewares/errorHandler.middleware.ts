import type { ErrorResponsePayload } from '@min-url/contracts/dto'
import {
	DomainError,
	SlugGenerationExhaustedError,
	SlugIsDeletedError,
	SlugIsExpiredError,
	SlugNotFoundError,
} from '@/core/domain/errors/domain.errors.ts'
import type { NextFunction, Request, Response } from 'express'

export const errorHandler = (
	error: Error,
	_req: Request,
	res: Response,
	_next: NextFunction,
): void => {
	if (error instanceof DomainError) {
		const payload: ErrorResponsePayload = {
			code: error.code || 'BAD_REQUEST',
			message: error.message,
		}

		if (error instanceof SlugNotFoundError) {
			res.status(404).json(payload)
			return
		}

		if (
			error instanceof SlugIsDeletedError ||
			error instanceof SlugIsExpiredError
		) {
			res.status(410).json(payload)
			return
		}

		if (error instanceof SlugGenerationExhaustedError) {
			res.status(503).json(payload)
			return
		}

		res.status(400).json(payload)
		return
	}

	console.error('Unhandled Server Error:', error)
	const internalPayload: ErrorResponsePayload = {
		code: 'INTERNAL_SERVER_ERROR',
		message: error.message,
	}
	res.status(500).json(internalPayload)
}
