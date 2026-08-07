import cors from 'cors'

export const corsMiddleware = (allowedOrigins: string[]) =>
	cors({
		origin: (origin, callback) => {
			if (!origin || allowedOrigins.includes(origin)) {
				callback(null, true)
			} else {
				callback(new Error('Not allowed by CORS'), false)
			}
		},
	})
