import { Router } from 'express'
import UrlController from '../controllers/UrlController.js'
import { validateUrl } from '../middleware/validateUrl.js'
const routesUrl = Router()

routesUrl.post('/', validateUrl, UrlController.createShortUrl)
// router.get('/:shortUrl', getShortUrl)

export default routesUrl
