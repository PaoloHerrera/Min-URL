import type { UrlController } from '@/adapters/primary/http/controllers/url.controller.ts'
import { Router } from 'express'
import type { RequestHandler } from 'express'

export const routesInternal = (
	urlController: UrlController,
	verifyInternalTokenMiddleware: RequestHandler,
) => {
	const router = Router()

	router.get(
		'/slug-data/:slug',
		verifyInternalTokenMiddleware,
		urlController.resolveRedirect,
	)

	return router
}
