import cors from 'cors'

export const corsMiddleware = () =>
	cors({
		origin: (origin, callback) => {
			const origins = process.env.CORS_ALLOWED_ORIGINS?.split(',') || [
				'http://localhost:4321',
			]

			if (!origin || origins.includes(origin)) {
				callback(null, true)
			} else {
				callback(new Error('Not allowed by CORS'), false)
			}
		},
	})
