import cors from 'cors'

export const corsMiddleware = (allowedOrigins: string[]) =>
	cors({
		origin: (origin, callback) => {
			const origins = allowedOrigins

			if (!origin || origins.includes(origin)) {
				callback(null, true)
			} else {
				callback(new Error('Not allowed by CORS'), false)
			}
		},
	})
