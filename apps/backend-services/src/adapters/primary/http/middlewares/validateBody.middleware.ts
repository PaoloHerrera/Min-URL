import { InvalidPayloadError } from '@/adapters/errors/infra.errors.ts'
import type { NextFunction, Request, Response } from 'express'
import type { z } from 'zod'

export const validateBody =
	(schema: z.ZodTypeAny) =>
	(req: Request, _res: Response, next: NextFunction) => {
		const result = schema.safeParse(req.body)

		if (!result.success) {
			const errorMessage =
				result.error.issues[0]?.message || 'Invalid request body'
			return next(new InvalidPayloadError(errorMessage))
		}

		req.body = result.data
		next()
	}
