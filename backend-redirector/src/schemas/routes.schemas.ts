import { z } from 'zod'

const slugSchema = z.object({
	slug: z
		.string()
		.min(6, 'Slug must be at least 6 characters long')
		.max(12, 'Slug must be at most 12 characters long')
		.regex(/^[a-zA-Z0-9]*$/, 'Slug must contain only alphanumeric characters'),
})

export type Slug = z.infer<typeof slugSchema>

export const getSlugSchema = {
	params: slugSchema,
	response: {
		302: z.any().describe('Redirect to the original URL'),
		500: z.string().describe('Internal server error'),
	},
}

export type GetSlugSchema = z.infer<typeof getSlugSchema>

export const slugDataSchema = z.object({
	slug: z.string(),
	originalUrl: z.url().optional(),
	password: z.boolean(),
})

export type SlugDataSchema = z.infer<typeof slugDataSchema>
