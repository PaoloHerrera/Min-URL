import { Router } from 'express'
import { urlController } from '../../../../bootstrap.ts'
import { validateSlug } from '../middlewares/validateSlug.ts'
import { verifyInternalToken } from '../middlewares/verifyInternalToken.ts'

const router = Router()

router.get(
	'/slug-data/:slug',
	verifyInternalToken,
	validateSlug,
	urlController.resolveRedirect,
)

export { router as routesInternal }
