import type { z } from 'zod'
import type {
	errorResponseSchema,
	shortenAnonymousRequestSchema,
	shortenAnonymousResponseSchema,
	slugDataResponseSchema,
} from './schemas.ts'

export type SlugDataResponse = z.infer<typeof slugDataResponseSchema>

export type ShortenAnonymousRequest = z.infer<
	typeof shortenAnonymousRequestSchema
>

export type ShortenAnonymousResponse = z.infer<
	typeof shortenAnonymousResponseSchema
>

export type ErrorResponsePayload = z.infer<typeof errorResponseSchema>
