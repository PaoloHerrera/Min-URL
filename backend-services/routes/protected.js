import { Router } from 'express'
import {
	checkSlug,
	getSlugData,
	returnSlugAvailability,
} from '../controllers/UrlController.js'
import { checkApiKey } from '../middleware/checkApiKey.js'
import { saveIp } from '../middleware/saveIp.js'
import {
	checkQrCodeAvailable,
	checkShortUrlAvailable,
} from '../middleware/checkAvailable.js'
import { validateUrl } from '../middleware/validateUrl.js'
import { checkForbiddenExtension } from '../middleware/checkForbiddenExtension.js'
import { handleAsyncError } from '../utils/utils.js'
import {
	createShortUrl,
	createShortUrlWithCustomSlug,
	createQrCode,
	deleteUserUrl,
} from '../controllers/UserController.js'
import { addGeolocation } from '../middleware/geolocationMiddleware.js'

const protectedRouter = Router()

protectedRouter.get('/slug-data/:slug', checkApiKey, getSlugData)

protectedRouter.post(
	'/check-slug',
	checkApiKey,
	checkSlug,
	returnSlugAvailability,
)

protectedRouter.post(
	'/create-short-url-with-custom-slug',
	checkApiKey,
	checkShortUrlAvailable,
	checkSlug,
	saveIp,
	validateUrl,
	checkForbiddenExtension,
	handleAsyncError(addGeolocation),
	handleAsyncError(createShortUrlWithCustomSlug),
)

protectedRouter.post(
	'/create-short-url',
	checkApiKey,
	checkShortUrlAvailable,
	saveIp,
	validateUrl,
	checkForbiddenExtension,
	handleAsyncError(addGeolocation),
	handleAsyncError(createShortUrl),
)

protectedRouter.post(
	'/create-qr-code',
	checkApiKey,
	checkQrCodeAvailable,
	saveIp,
	validateUrl,
	checkForbiddenExtension,
	handleAsyncError(addGeolocation),
	handleAsyncError(createQrCode),
)

protectedRouter.delete(
	'/delete-url/:id',
	checkApiKey,
	handleAsyncError(deleteUserUrl),
)

export { protectedRouter }
