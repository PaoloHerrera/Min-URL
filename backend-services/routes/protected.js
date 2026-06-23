import { Router } from 'express'
import {
	checkSlug,
	checkSlugAvailability,
	getSlugData,
	returnSlugAvailability,
} from '../controllers/urlController.js'
import {
	createQrCode,
	createShortUrl,
	createShortUrlWithCustomSlug,
	deleteUserUrl,
	updateUserUrl,
} from '../controllers/userController.js'
import { checkApiKey } from '../middleware/checkApiKey.js'
import {
	checkQrCodeAvailable,
	checkShortUrlAvailable,
} from '../middleware/checkAvailable.js'
import { checkForbiddenExtension } from '../middleware/checkForbiddenExtension.js'
import { addGeolocation } from '../middleware/geolocationMiddleware.js'
import { validateUrl } from '../middleware/validateUrl.js'

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
	validateUrl,
	checkForbiddenExtension,
	addGeolocation,
	createShortUrlWithCustomSlug,
)

protectedRouter.post(
	'/create-short-url',
	checkApiKey,
	checkShortUrlAvailable,
	validateUrl,
	checkForbiddenExtension,
	addGeolocation,
	createShortUrl,
)

protectedRouter.post(
	'/create-qr-code',
	checkApiKey,
	checkQrCodeAvailable,
	validateUrl,
	checkForbiddenExtension,
	addGeolocation,
	createQrCode,
)

protectedRouter.delete('/delete-url/:id', checkApiKey, deleteUserUrl)

protectedRouter.patch(
	'/update-url/:id',
	checkApiKey,
	validateUrl,
	checkForbiddenExtension,
	checkSlug,
	updateUserUrl,
)

export { protectedRouter }
