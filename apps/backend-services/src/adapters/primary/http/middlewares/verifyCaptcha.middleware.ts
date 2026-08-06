import {
	CaptchaServiceError,
	InvalidCaptchaTokenError,
} from '@/adapters/errors/infra.errors.ts'
import type { CaptchaServicePort } from '@/core/ports/outbound/CaptchaServicePort.interface.ts'
import type { NextFunction, Request, Response } from 'express'

export const createVerifyCaptchaMiddleware = (
	captchaService: CaptchaServicePort,
) => {
	return async (req: Request, _res: Response, next: NextFunction) => {
		const rawToken = req.body?.captchaToken || req.body?.turnstileToken
		const captchaToken = typeof rawToken === 'string' ? rawToken.trim() : null
		if (!captchaToken || captchaToken.length === 0) {
			return next(new InvalidCaptchaTokenError())
		}
		try {
			const isValid = await captchaService.verify(captchaToken)

			if (!isValid) {
				return next(new InvalidCaptchaTokenError())
			}
			next()
		} catch (_error) {
			return next(new CaptchaServiceError())
		}
	}
}
