import '@/bootstrap-env.ts'
import { z } from 'zod'

export const envSchema = z.object({
	PORT: z.coerce.number().int().min(1).max(65535).default(3001),
	NODE_ENV: z.enum(['development', 'production', 'test']),
	REDIRECTOR_URL: z.url().min(1, 'REDIRECTOR_URL is required'),
	DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
	ADMIN_URL: z.url().min(1, 'ADMIN_URL is required'),
	TURNSTILE_SECRET_KEY: z.string().min(1, 'TURNSTILE_SECRET_KEY is required'),
	INTERNAL_SECRET: z
		.string()
		.min(32, 'INTERNAL_SECRET must be at least 32 characters long'),
	CORS_ALLOWED_ORIGINS: z.string().min(1, 'CORS_ALLOWED_ORIGINS is required'),
	ENABLE_SWAGGER: z.stringbool().default(false),
})

export type Env = z.infer<typeof envSchema>
export const env = envSchema.parse(process.env)
