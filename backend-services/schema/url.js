import z from 'zod'

const urlSchema = z.object({
	user_id: z.number().positive().optional(),
	long_url: z.string().url({ message: 'Invalid url' }),
	slug: z.string(),
	clicks: z.number().int().default(0),
	purpose: z.enum(['direct', 'qr', 'api']),
	qr_url: z.string().url().optional(),
	password: z.boolean().optional(),
	password_text: z.string().optional(),
	expiration: z.boolean().optional(),
	expiration_date: z.string().datetime().optional(),
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
