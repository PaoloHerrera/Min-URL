import { urlController } from '@/bootstrap.ts'
import { shortenAnonymousRequestSchema } from '@min-url/contracts/schemas'
import { Router } from 'express'
import { jsonPayloadLimit } from '../middlewares/jsonPayloadLimit.middleware.ts'
import { validateBody } from '../middlewares/validateBody.middleware.ts'

const routesShortUrl = Router()

routesShortUrl.post(
	'/direct/shorten',
	jsonPayloadLimit(5),
	validateBody(shortenAnonymousRequestSchema),
	urlController.createAnonymous,
)

export { routesShortUrl }
