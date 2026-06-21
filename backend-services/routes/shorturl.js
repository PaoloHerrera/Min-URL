import { Router } from 'express'
import { getShortUrl } from '../controllers/urlController.js'
import { handleUrlErrors } from '../middleware/urlMiddlewares.js'
import { verifyGeoIp } from '../middleware/verifyIp.js'
import { handleAsyncError } from '../utils/utils.js'

const routesShortUrl = Router()

routesShortUrl.get('/:slug', verifyGeoIp, handleAsyncError(getShortUrl))

routesShortUrl.use(handleUrlErrors)

export { routesShortUrl }
