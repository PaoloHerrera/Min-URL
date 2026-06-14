import { Router } from 'express'
import {
	checkSlug,
	checkSlugAvailability,
	getSlugData,
	returnSlugAvailability,
} from '../controllers/UrlController.js'
import {
	createQrCode,
	createShortUrl,
	createShortUrlWithCustomSlug,
	deleteUserUrl,
	updateUserUrl,
} from '../controllers/UserController.js'
import { checkApiKey } from '../middleware/checkApiKey.js'
import {
	checkQrCodeAvailable,
	checkShortUrlAvailable,
} from '../middleware/checkAvailable.js'
import { checkForbiddenExtension } from '../middleware/checkForbiddenExtension.js'
import { addGeolocation } from '../middleware/geolocationMiddleware.js'
import { saveIp } from '../middleware/saveIp.js'
import { validateUrl } from '../middleware/validateUrl.js'
import { handleAsyncError } from '../utils/utils.js'

const protectedRouter = Router()

protectedRouter.get('/slug-data/:slug', checkApiKey, getSlugData)

protectedRouter.post(
	'/check-slug',
	checkApiKey,
	checkSlug,
	checkSlugAvailability,
	returnSlugAvailability,
)

protectedRouter.post(
	'/create-short-url-with-custom-slug',
	checkApiKey,
	checkShortUrlAvailable,
	checkSlug,
	checkSlugAvailability,
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

protectedRouter.patch(
	'/update-url/:id',
	checkApiKey,
	validateUrl,
	checkForbiddenExtension,
	checkSlug,
	handleAsyncError(updateUserUrl),
)

export { protectedRouter }
