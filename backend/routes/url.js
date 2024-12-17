import { Router } from 'express'
import UrlController from '../controllers/UrlController.js'
import { validateUrl } from '../middleware/validateUrl.js'
import { limitRequests } from '../middleware/limitRequests.js'
const routesUrl = Router()

routesUrl.post('/', limitRequests, validateUrl, UrlController.createShortUrl)

export default routesUrl
