import { Router } from 'express'
import UrlController from '../controllers/UrlController.js'
const routesUrl = Router()

routesUrl.post('/', UrlController.createShortUrl)
// router.get('/:shortUrl', getShortUrl)

export default routesUrl
