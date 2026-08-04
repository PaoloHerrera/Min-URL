import { json } from 'express'
import type { NextFunction, Request, Response } from 'express'
import {
	InvalidJsonError,
	PayloadTooLargeError,
} from '../errors/http.errors.ts'

interface BodyParserError extends Error {
	type?: string
	status?: number
	statusCode?: number
}

const isPayloadTooLargeError = (err: unknown): boolean => {
	if (typeof err === 'object' && err != null) {
		const e = err as BodyParserError
		return (
			e.type === 'entity.too.large' || e.statusCode === 413 || e.status === 413
		)
	}
	return false
}

export const jsonPayloadLimit = (limit: number) => {
	const jsonMiddleware = json({ limit: `${limit}kb` })

	return (req: Request, res: Response, next: NextFunction) => {
		jsonMiddleware(req, res, (err: unknown) => {
			if (isPayloadTooLargeError(err)) {
				return next(new PayloadTooLargeError())
			}
			if (err instanceof SyntaxError) {
				return next(new InvalidJsonError())
			}
			return next(err)
		})
	}
}
