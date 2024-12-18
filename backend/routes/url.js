import { Router } from 'express'
import UrlController from '../controllers/UrlController.js'
import { validateUrl } from '../middleware/validateUrl.js'
import { limitRequests } from '../middleware/limitRequests.js'
import { verifyRecaptcha } from '../middleware/verifyRecaptcha.js'

const routesUrl = Router()

routesUrl.post('/', verifyRecaptcha, limitRequests, validateUrl, UrlController.createShortUrl)

export default routesUrl
