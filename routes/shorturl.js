import { Router } from 'express'
import UrlController from '../controllers/UrlController.js'
const routesShortUrl = Router()

routesShortUrl.get('/:id', UrlController.getShortUrl)

export default routesShortUrl
