import axios from 'axios'
import { RECAPTCHA_SITE_KEY, SHORT_URL_API } from '../constants'

// Este hook se encarga de generar el token de recaptcha
const generateRecaptchaToken = async () =>
	new Promise((resolve) => {
		window.grecaptcha.ready(() => {
			window.grecaptcha
				.execute(RECAPTCHA_SITE_KEY, { action: 'submit' })
				.then(async (token) => {
					resolve(token)
				})
		})
	})

// Este hook se encarga de acortar la URL
// Si la URL es inválida se devuelve un error
export async function fetchUrl(url) {
	const token = await generateRecaptchaToken()
	try {
		const response = await axios.post(SHORT_URL_API, {
			originalUrl: url,
			recaptchaToken: token,
		})
		return response.data.fullShortUrl
	} catch (error) {
		throw new Error(
			error.response?.data?.message ||
				'An error occurred. Please try again later.',
		)
	}
}
