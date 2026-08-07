import { corsMiddleware } from '@/adapters/primary/http/middlewares/cors.middleware.ts'
import { errorHandler } from '@/adapters/primary/http/middlewares/errorHandler.middleware.ts'
import { rateLimiter } from '@/adapters/primary/http/middlewares/rateLimiter.middleware.ts'
import { routesInternal } from '@/adapters/primary/http/routes/internal.route.ts'
import { routesShortUrl } from '@/adapters/primary/http/routes/shorturl.route.ts'
import type { Db } from '@/adapters/secondary/db/connection.ts'
import type { Env } from '@/config/env.ts'
import express, { type Request, type Response } from 'express'
import helmet from 'helmet'
import swaggerUi from 'swagger-ui-express'
import { bootstrap } from './bootstrap.ts'
import { swaggerDocument } from './swagger.ts'

export const buildApp = (env: Env, db: Db) => {
	const app = express()

	// Resolve dependencies from the composition root
	const {
		urlController,
		verifyCaptchaMiddleware,
		verifyInternalTokenMiddleware,
	} = bootstrap(env, db)

	// Security headers
	app.use(helmet({ xFrameOptions: { action: 'deny' } }))

	// CORS
	const allowedOrigins = env.CORS_ALLOWED_ORIGINS.split(',')
		.map((origin) => origin.trim())
		.filter((origin) => origin.length > 0)

	app.use(corsMiddleware(allowedOrigins))

	// Trust reverse proxy (required for accurate req.ip behind load balancers)
	app.set('trust proxy', 1)

	// Rate limiting
	app.use(
		rateLimiter({
			enabled: env.RATE_LIMIT_ENABLED,
			windowMs: env.RATE_LIMIT_WINDOW_MS,
			maxRequests: env.RATE_LIMIT_MAX_REQUESTS,
		}),
	)

	// Application routes
	app.use('/', routesShortUrl(urlController, verifyCaptchaMiddleware))
	app.use(
		'/internal',
		routesInternal(urlController, verifyInternalTokenMiddleware),
	)

	// Utility routes
	app.get('/', (_req: Request, res: Response) => {
		res.redirect('https://min-url.com')
	})
	app.get('/favicon.ico', (_req: Request, res: Response) => {
		res.status(204).end()
	})

	// API docs (disabled in production unless explicitly enabled)
	if (env.NODE_ENV !== 'production' || env.ENABLE_SWAGGER === true) {
		app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
	}

	// Centralized error handler (must be last)
	app.use(errorHandler)

	return app
}
