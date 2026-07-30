import { z } from 'zod'

export const envSchema = z.object({
	PORT: z.coerce.number().int().min(1).max(65535).default(3002),
	NODE_ENV: z
		.enum(['development', 'production', 'test'])
		.default('development'),
	FRONTEND_URL: z.url('FRONTEND_URL must be a valid URL'),
	BACKEND_API_URL: z.url('BACKEND_API_URL must be a valid URL'),
	INTERNAL_SECRET: z
		.string()
		.min(32, 'INTERNAL_SECRET must be at least 32 characters long'),
})

export type Env = z.infer<typeof envSchema>
export const env = envSchema.parse(process.env)
