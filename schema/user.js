import z from 'zod'

const userSchema = z.object({
	id_users: z.number().positive(),
	google_id: z.string().optional(),
	github_id: z.string().optional(),
	email: z.string().email(),
	name: z.string().optional(),
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

export function validateUser(input) {
	return userSchema.safeParse(input)
}
