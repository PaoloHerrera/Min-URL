import { Router } from 'express'
import { createQrCode } from '../controllers/QrCodeController.js'
import { verifyGeoIp } from '../middleware/verifyIp.js'
import { validateUrl } from '../middleware/validateUrl.js'
import { limitQRCodePerDay } from '../middleware/limitRequests.js'
import { insertQrPurpose } from '../middleware/insertPurpose.js'
import { verifyRecaptcha } from '../middleware/verifyRecaptcha.js'
import { checkForbiddenExtension } from '../middleware/checkForbiddenExtension.js'
import { createShortUrl } from '../controllers/UrlController.js'
import { handleAsyncError } from '../utils/utils.js'
import { handleQrCodeErrors } from '../middleware/urlMiddlewares.js'

const routesQrCode = Router()

routesQrCode.post(
	'/',
	verifyRecaptcha,
	limitQRCodePerDay,
	validateUrl,
	checkForbiddenExtension,
	verifyGeoIp,
	insertQrPurpose,
	handleAsyncError(createShortUrl),
	handleAsyncError(createQrCode),
)

routesQrCode.use(handleQrCodeErrors)
// routesQrCode.get('/:id', getQrCode)

export default routesQrCode
