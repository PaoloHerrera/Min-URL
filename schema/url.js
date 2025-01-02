import z from 'zod'

const urlSchema = z.object({
	user_id_user: z.number().positive().optional(),
	id_url_hash: z.string(64),
	longurl: z.string().url({ message: 'Invalid url' }),
	shorturl: z.string(),
	clicks: z.number().int().default(0),
	ip_address: z.string().ip({ version: 'v4' | 'v6' }),
	country: z.string().optional(),
	region: z.string().optional(),
	timezone: z.string().optional(),
	city: z.string().optional(),
	latitude: z.number().optional(),
	longitude: z.number().optional(),
	deleted: z.boolean().default(false),
	created_at: z
		.string()
		.datetime()
		.default(() => new Date().toISOString()),
	updated_at: z
		.string()
		.datetime()
		.default(() => new Date().toISOString()),
	deleted_at: z.string().datetime().optional(),
})

export function validateUrl(input) {
	return urlSchema.safeParse(input)
}
