import axios from 'axios'

type AnonFetchUrlProps = {
	url: string
	apiUrl: string
	recaptchaToken: string
}

export async function anonFetchUrl({
	url,
	apiUrl,
	recaptchaToken,
}: AnonFetchUrlProps) {
	try {
		return await axios.post(apiUrl, {
			originalUrl: url,
			recaptchaToken,
		})
	} catch (error) {
		if (axios.isAxiosError(error)) {
			throw new Error(
				error.response?.data?.message ||
					'An error occurred. Please try again later.',
			)
		}
		throw new Error('An error occurred. Please try again later.')
	}
}
