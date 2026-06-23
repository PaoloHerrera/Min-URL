import { Router } from 'express'
import { getShortUrl } from '../controllers/urlController.js'
import { createShortUrlAnonymous } from '../controllers/userController.js'
import { checkForbiddenExtension } from '../middleware/checkForbiddenExtension.js'
import { addGeolocation } from '../middleware/geolocationMiddleware.js'
import { handleUrlErrors } from '../middleware/urlMiddlewares.js'
import { validateUrl } from '../middleware/validateUrl.js'
import { verifyGeoIp } from '../middleware/verifyIp.js'
import { verifyRecaptcha } from '../middleware/verifyRecaptcha.js'

const routesShortUrl = Router()

routesShortUrl.get('/:slug', verifyGeoIp, getShortUrl)

routesShortUrl.post(
	'/direct/shorten',
	verifyRecaptcha,
	validateUrl,
	checkForbiddenExtension,
	addGeolocation,
	createShortUrlAnonymous,
)

routesShortUrl.use(handleUrlErrors)

export { routesShortUrl }
