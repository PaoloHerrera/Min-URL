import axios from 'axios'

export const turnstileService = (token) => {
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
