import { urlController } from '@/bootstrap.ts'
import { Router } from 'express'
import { verifyInternalToken } from '../middlewares/verifyInternalToken.middleware.ts'

const router = Router()

router.get(
	'/slug-data/:slug',
	verifyInternalToken,
	urlController.resolveRedirect,
)

export { router as routesInternal }
