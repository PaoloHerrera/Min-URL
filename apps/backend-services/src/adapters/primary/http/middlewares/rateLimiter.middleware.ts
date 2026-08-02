import { TooManyRequestsError } from '@/core/domain/errors/domain.errors.ts'
import type { NextFunction, Request, Response } from 'express'
import { rateLimit } from 'express-rate-limit'

/**
 * Rate limiter middleware to prevent abuse of the API.
 * Delegates 429 response formatting to central errorHandler middleware.
 * @param config - Configuration for the rate limiter.
 * @returns Express middleware.
 */
export const rateLimiter = (config: {
	enabled: boolean
	windowMs: number
	maxRequests: number
}) => {
	return rateLimit({
		windowMs: config.windowMs,
		limit: config.maxRequests,
		standardHeaders: true,
		legacyHeaders: false,
		skip: () => !config.enabled,
		handler: (_req: Request, _res: Response, next: NextFunction) => {
			next(new TooManyRequestsError())
		},
	})
}
