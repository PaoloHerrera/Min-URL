import { Router } from 'express'
import { createShortUrl, sendShortUrl } from '../controllers/UrlController.js'
import { validateUrl } from '../middleware/validateUrl.js'
import { limitShortUrlPerDay } from '../middleware/limitRequests.js'
import { insertDirectPurpose } from '../middleware/insertPurpose.js'
import { verifyRecaptcha } from '../middleware/verifyRecaptcha.js'
import { checkForbiddenExtension } from '../middleware/checkForbiddenExtension.js'
import { verifyGeoIp } from '../middleware/verifyIp.js'
import rateLimit from 'express-rate-limit'
import { handleAsyncError } from '../utils/utils.js'
import { handleUrlErrors } from '../middleware/urlMiddlewares.js'

const routesUrl = Router()

// Limitador de peticiones
const generalLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
	standardHeaders: true,
	legacyHeaders: false,
	keyGenerator: (req) => req.ip,
	message: 'Too many requests from this IP, please try again after 15 minutes.',
})

routesUrl.use('/', generalLimiter)
routesUrl.post(
	'/',
	verifyRecaptcha,
	limitShortUrlPerDay,
	validateUrl,
	checkForbiddenExtension,
	verifyGeoIp,
	insertDirectPurpose,
	handleAsyncError(createShortUrl),
	sendShortUrl,
)

routesUrl.use(handleUrlErrors)

export default routesUrl
