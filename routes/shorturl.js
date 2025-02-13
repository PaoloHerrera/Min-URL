import { Router } from 'express'
import { getShortUrl } from '../controllers/UrlController.js'
import { verifyGeoIp } from '../middleware/verifyIp.js'
import { handleAsyncError } from '../utils/utils.js'
import { handleUrlErrors } from '../middleware/urlMiddlewares.js'

const routesShortUrl = Router()

routesShortUrl.get('/:slug', verifyGeoIp, handleAsyncError(getShortUrl))

routesShortUrl.use(handleUrlErrors)

export default routesShortUrl
