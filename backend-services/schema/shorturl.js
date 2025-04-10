import z from 'zod'

const ShortUrlSchema = z.object({
	url_id: z.string().uuid(),
	slug: z.string(16),
	created_at: z
		.string()
		.datetime()
		.default(() => new Date().toISOString()),
})

export function validateShortUrl(input) {
	return ShortUrlSchema.safeParse(input)
}
