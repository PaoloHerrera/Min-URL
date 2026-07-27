import { z } from 'zod'

export const urlSchema = z.object({
	url: z
		.string()
		.trim()
		.max(2048, 'URL must not exceed 2048 characters')
		.transform((val) => {
			let formatted = val
			if (
				!z.regexes.httpProtocol.test(formatted) &&
				z.regexes.domain.test(formatted)
			) {
				formatted = `http://${formatted}`
			}
			return formatted
		})
		.refine((val) => {
			try {
				const url = new URL(val)
				return url.protocol === 'http:' || url.protocol === 'https:'
			} catch {
				return false
			}
		}),
})

export type UrlSchema = z.infer<typeof urlSchema>
