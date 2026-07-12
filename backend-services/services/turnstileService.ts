import axios from 'axios'

type TurnstileToken = string | undefined | null

interface TurnstileResponse {
	success: boolean
	challenge_ts?: string
	action?: string
	cdata?: string
	'error-codes'?: string[] // Corregido con guion y opcional
	hostname?: string
}

export const turnstileService = (
	token: TurnstileToken,
): Promise<TurnstileResponse> => {
	return new Promise((resolve, reject) => {
		axios
			.post('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
				secret: process.env.TURNSTILE_SECRET_KEY,
				response: token,
			})
			.then(({ data }) => resolve(data))
			.catch((err) => reject(err))
	})
}
