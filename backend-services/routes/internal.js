import { Router } from 'express'
import { validateSlug } from '../middleware/validateSlug.js'
import { verifyInternalToken } from '../middleware/verifyInternalToken.js'
import { urlController } from '../src/bootstrap.js'

const router = Router()

router.get(
	'/slug-data/:slug',
	verifyInternalToken,
	validateSlug,
	urlController.getUrlMetadataInternal,
)

export { router as routesInternal }
