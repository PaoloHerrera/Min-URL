import { Router } from 'express'
import { checkSlug } from '../controllers/UrlController.js'
import { checkApiKey } from '../middleware/checkApiKey.js'

const checkRouter = Router()

checkRouter.post('/check-slug', checkApiKey, checkSlug)

checkRouter.get('/check-slug', (req, res) => {
	console.log(req.headers)
	return res.status(200).json({ message: 'check-slug' })
})

export { checkRouter }
