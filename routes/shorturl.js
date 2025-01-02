import { Router } from 'express'
import { getShortUrl } from '../controllers/UrlController.js'
const routesShortUrl = Router()

routesShortUrl.get('/:id', getShortUrl)

export default routesShortUrl
