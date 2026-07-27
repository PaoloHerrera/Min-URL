import { z } from 'zod'

const MAX_URL_LENGTH = 2048

export const slugDataResponseSchema = z.object({
	slug: z.string(),
	password: z.boolean(),
	originalUrl: z.url().max(MAX_URL_LENGTH).optional(),
	queryAt: z.iso.datetime(),
})

export const errorResponseSchema = z.object({
	code: z.string(),
	message: z.string(),
})

export const shortenAnonymousRequestSchema = z.object({
	originalUrl: z.url().max(MAX_URL_LENGTH),
	captchaToken: z.string().optional(),
	turnstileToken: z.string().optional(),
})

export const shortenAnonymousResponseSchema = z.object({
	originalUrl: z.url().max(MAX_URL_LENGTH),
	shortUrl: z.url(),
	slug: z.string(),
	createdAt: z.iso.datetime(),
})

export const slugRegex = /^[a-zA-Z0-9]{6,12}$/
