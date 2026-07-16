import { Router } from 'express'
import { urlController } from '../../../../bootstrap.ts'
import { checkForbiddenExtension } from '../middlewares/checkForbiddenExtension.middleware.ts'
import { validateUrl } from '../middlewares/validateUrl.middleware.ts'

const routesShortUrl = Router()

routesShortUrl.post(
	'/direct/shorten',
	validateUrl,
	checkForbiddenExtension,
	urlController.createAnonymous,
)

export { routesShortUrl }
