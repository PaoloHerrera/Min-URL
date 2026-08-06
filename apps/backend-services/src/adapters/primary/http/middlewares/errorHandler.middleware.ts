import { InfraError } from '@/adapters/errors/infra.errors.ts'
import { DomainError } from '@/core/domain/errors/domain.errors.ts'
import type { ErrorResponsePayload } from '@min-url/contracts/dto'
import { INFRA_ERROR, resolveHttpStatusCode } from '@min-url/contracts/errors'
import type { NextFunction, Request, Response } from 'express'

export const errorHandler = (
	error: Error,
	_req: Request,
	res: Response,
	_next: NextFunction,
): void => {
	if (error instanceof DomainError || error instanceof InfraError) {
		const statusCode = resolveHttpStatusCode(error.code)
		const responsePayload: ErrorResponsePayload = {
			code: error.code,
			message: error.message,
		}
		res.status(statusCode).json(responsePayload)
		return
	}

	console.error('Unhandled Server Error:', error)
	const internalPayload: ErrorResponsePayload = {
		code: INFRA_ERROR.internalServerError.code,
		message: INFRA_ERROR.internalServerError.message,
	}
	res.status(500).json(internalPayload)
}
