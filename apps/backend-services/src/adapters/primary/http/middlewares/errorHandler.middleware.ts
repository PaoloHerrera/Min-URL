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
		if (error instanceof SlugNotFoundError) {
			res.status(404).json({
				code: error.code,
				message: error.message,
			})
			return
		}

		if (
			error instanceof SlugIsDeletedError ||
			error instanceof SlugIsExpiredError
		) {
			res.status(410).json({
				code: error.code,
				message: error.message,
			})
			return
		}

		if (error instanceof SlugGenerationExhaustedError) {
			res.status(503).json({
				code: error.code,
				message: error.message,
			})
			return
		}

		res.status(400).json({
			code: error.code || 'BAD_REQUEST',
			message: error.message,
		})
		return
	}

	console.error('Unhandled Server Error:', error)
	res.status(500).json({
		error: 'Internal Server Error',
		message: error.message,
	})
}
