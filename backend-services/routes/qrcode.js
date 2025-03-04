import { Router } from 'express'
import { verifyGeoIp } from '../middleware/verifyIp.js'
import { validateUrl } from '../middleware/validateUrl.js'
import { limitQrCodePerDay } from '../middleware/limitRequests.js'
import { insertQrPurpose } from '../middleware/insertPurpose.js'
import { verifyRecaptcha } from '../middleware/verifyRecaptcha.js'
import { checkForbiddenExtension } from '../middleware/checkForbiddenExtension.js'
import { createShortUrl, sendShortUrl } from '../controllers/UrlController.js'
import { handleAsyncError } from '../utils/utils.js'
import { handleQrCodeErrors } from '../middleware/urlMiddlewares.js'

const routesQrCode = Router()

routesQrCode.post(
	'/',
	verifyRecaptcha,
	limitQrCodePerDay,
	validateUrl,
	checkForbiddenExtension,
	verifyGeoIp,
	insertQrPurpose,
	handleAsyncError(createShortUrl),
	sendShortUrl,
)

routesQrCode.use(handleQrCodeErrors)
// routesQrCode.get('/:id', getQrCode)

export { routesQrCode }
