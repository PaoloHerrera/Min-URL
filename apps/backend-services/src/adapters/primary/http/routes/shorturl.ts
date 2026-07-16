import { Router } from 'express'
import { urlController } from '../../../../bootstrap.ts'
import { checkForbiddenExtension } from '../middlewares/checkForbiddenExtension.ts'
import { validateUrl } from '../middlewares/validateUrl.ts'

const routesShortUrl = Router()

routesShortUrl.post(
	'/direct/shorten',
	validateUrl,
	checkForbiddenExtension,
	urlController.createAnonymous,
)

export { routesShortUrl }
