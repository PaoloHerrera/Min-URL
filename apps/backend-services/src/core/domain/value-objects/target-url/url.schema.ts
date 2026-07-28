import { httpUrlSchema } from '@min-url/contracts/schemas'
import { z } from 'zod'

export const urlSchema = z.object({
	url: z
		.string()
		.trim()
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
		.pipe(httpUrlSchema),
})

export type UrlSchema = z.infer<typeof urlSchema>
