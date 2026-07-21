import { z } from 'zod'

export const passwordSchema = z.object({
	password: z
		.string()
		.min(6, 'Password must be at least 6 characters long')
		.max(16, 'Password must be at most 16 characters long')
		.regex(
			/^[a-zA-Z0-9\s\-_.,!@#$%^&*]{6,16}$/,
			'Password must contain only letters, numbers and special characters',
		),
})

export type PasswordInput = z.infer<typeof passwordSchema>
