import { Router } from 'express'
import UrlController from '../controllers/UrlController.js'
import { validateUrl } from '../middleware/validateUrl.js'
import { limitRequestsMiddleware } from '../middleware/limitRequestsMiddleware.js'
const routesUrl = Router()

routesUrl.post('/', limitRequestsMiddleware, validateUrl, UrlController.createShortUrl)
// router.get('/:shortUrl', getShortUrl)

export default routesUrl
