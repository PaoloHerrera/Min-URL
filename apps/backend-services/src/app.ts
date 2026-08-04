import { corsMiddleware } from '@/adapters/primary/http/middlewares/cors.middleware.ts'
import { errorHandler } from '@/adapters/primary/http/middlewares/errorHandler.middleware.ts'
import { rateLimiter } from '@/adapters/primary/http/middlewares/rateLimiter.middleware.ts'
import { routesInternal } from '@/adapters/primary/http/routes/internal.route.ts'
import { routesShortUrl } from '@/adapters/primary/http/routes/shorturl.route.ts'
import express, { type Request, type Response } from 'express'
import swaggerUi from 'swagger-ui-express'
import { env } from './config/env.ts'
import { swaggerDocument } from './swagger.ts'
import helmet from 'helmet'

const app = express()
app.use(
	helmet({
		xFrameOptions: { action: 'deny' },
	}),
)
app.use(corsMiddleware())

// Habilitar trust proxy
app.set('trust proxy', 1)

// Rate Limiter
app.use(
	rateLimiter({
		enabled: env.RATE_LIMIT_ENABLED,
		windowMs: env.RATE_LIMIT_WINDOW_MS,
		maxRequests: env.RATE_LIMIT_MAX_REQUESTS,
	}),
)

// Routes
app.use('/', routesShortUrl)
app.use('/internal', routesInternal)

app.get('/', (req: Request, res: Response) => {
	console.log(`IP del cliente: ${req.ip}`)
	res.redirect('https://min-url.com')
})

// favicon
app.get('/favicon.ico', (_req: Request, res: Response) => {
	res.status(204).end()
})

// Swagger UI
if (env.NODE_ENV !== 'production' || env.ENABLE_SWAGGER === true) {
	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
}

// Errores centralizados
app.use(errorHandler)

export { app }
