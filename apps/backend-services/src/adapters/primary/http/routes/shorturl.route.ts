import { urlController } from '@/bootstrap.ts'
import { Router } from 'express'

const routesShortUrl = Router()

routesShortUrl.post('/direct/shorten', urlController.createAnonymous)

export { routesShortUrl }
