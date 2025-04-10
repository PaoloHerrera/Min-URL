import z from 'zod'

const urlSchema = z.object({
	user_id: z.string().uuid().optional(),
	geolocations_id: z.string().uuid().optional(),
	title: z
		.string()
		.min(1, { message: 'Title is required' })
		.max(100, { message: 'Title must be less than 255 characters' }),
	long_url: z.string().url({ message: 'Invalid url' }),
	purpose: z.enum(['direct', 'qr', 'api']),
	password: z.boolean().optional(),
	password_hash: z.string(128).optional(),
	expiration: z.boolean().optional(),
	expiration_date: z.string().datetime().optional(),
	expired: z.boolean().optional(),
	expired_at: z.string().datetime().optional(),
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
