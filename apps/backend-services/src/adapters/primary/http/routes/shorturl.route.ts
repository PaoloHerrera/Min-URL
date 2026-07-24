import { urlController } from '@/bootstrap.ts'
import { shortenAnonymousRequestSchema } from '@min-url/contracts/schemas'
import { Router } from 'express'
import { validateBody } from '../middlewares/validateBody.middleware.ts'

const routesShortUrl = Router()

routesShortUrl.post(
	'/direct/shorten',
	validateBody(shortenAnonymousRequestSchema),
	urlController.createAnonymous,
)

export { routesShortUrl }
