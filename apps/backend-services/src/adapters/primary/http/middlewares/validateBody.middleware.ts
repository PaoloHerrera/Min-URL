import type { ErrorResponsePayload } from '@min-url/contracts/dto'
import { API_ERROR_CODES } from '@min-url/contracts/errors'
import type { NextFunction, Request, Response } from 'express'
import type { z } from 'zod'

export const validateBody = (schema: z.ZodSchema) => {
	return (req: Request, res: Response, next: NextFunction): void => {
		const result = schema.safeParse(req.body)

		if (!result.success) {
			const payload: ErrorResponsePayload = {
				code: API_ERROR_CODES.invalidPayload,
				message: result.error.issues[0]?.message || 'Invalid request body',
			}
			res.status(400).json(payload)
			return
		}

		req.body = result.data
		next()
	}
}
