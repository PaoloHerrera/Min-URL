import { z } from 'zod'

export const MAX_URL_LENGTH = 2048

export const httpUrlSchema = z
	.url()
	.max(MAX_URL_LENGTH)
	.refine(
		(val) => {
			try {
				const parsed = new URL(val)
				return parsed.protocol === 'http:' || parsed.protocol === 'https:'
			} catch {
				return false
			}
		},
		{ message: 'URL must use http:// or https:// protocol' },
	)

export const slugDataResponseSchema = z.object({
	slug: z.string(),
	password: z.boolean(),
	originalUrl: httpUrlSchema.optional(),
	queryAt: z.iso.datetime(),
})

export const errorResponseSchema = z.object({
	code: z.string(),
	message: z.string(),
})

export const shortenAnonymousRequestSchema = z.object({
	originalUrl: httpUrlSchema,
	captchaToken: z.string().optional(),
	turnstileToken: z.string().optional(),
})

export const shortenAnonymousResponseSchema = z.object({
	originalUrl: httpUrlSchema,
	shortUrl: httpUrlSchema,
	slug: z.string(),
	createdAt: z.iso.datetime(),
})

export const slugRegex = /^[a-zA-Z0-9]{6,12}$/
