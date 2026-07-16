import { z } from 'zod'

export const envSchema = z.object({
	FRONTEND_URL: z.url(),
	BACKEND_API_URL: z.url(),
	INTERNAL_SECRET: z.string().min(1),
})

export type Env = z.infer<typeof envSchema>

export const getEnv = () => {
	return envSchema.parse(process.env)
}
