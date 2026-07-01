import { Router } from 'express'
import { getShortUrl } from '../controllers/urlController.js'
import { checkForbiddenExtension } from '../middleware/checkForbiddenExtension.js'
import { handleUrlErrors } from '../middleware/urlMiddlewares.js'
import { validateUrl } from '../middleware/validateUrl.js'
import { verifyGeoIp } from '../middleware/verifyIp.js'
import { urlController } from '../src/bootstrap.js'

const routesShortUrl = Router()

routesShortUrl.get('/:slug', verifyGeoIp, getShortUrl)

routesShortUrl.post(
	'/direct/shorten',
	validateUrl,
	checkForbiddenExtension,
	urlController.createAnonymous,
)

routesShortUrl.use(handleUrlErrors)

export { routesShortUrl }
