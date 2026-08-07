import type { UrlController } from '@/adapters/primary/http/controllers/url.controller.ts'
import { shortenAnonymousRequestSchema } from '@min-url/contracts/schemas'
import { Router } from 'express'
import type { RequestHandler } from 'express'
import { jsonPayloadLimit } from '../middlewares/jsonPayloadLimit.middleware.ts'
import { validateBody } from '../middlewares/validateBody.middleware.ts'

export const routesShortUrl = (
	urlController: UrlController,
	verifyCaptchaMiddleware: RequestHandler,
) => {
	const router = Router()

	router.post(
		'/direct/shorten',
		jsonPayloadLimit(5),
		validateBody(shortenAnonymousRequestSchema),
		verifyCaptchaMiddleware,
		urlController.createAnonymous,
	)

	return router
}
