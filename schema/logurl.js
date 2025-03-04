import z from 'zod'

const logurlSchema = z.object({
	url_id: z.number().positive(),
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

export function validateLogUrl(input) {
	return logurlSchema.safeParse(input)
}
