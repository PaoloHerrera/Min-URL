import { RECAPTCHA_SITE_KEY } from '@/modules/core/utils/constants.ts'

type Recaptcha = {
	loadScript: () => Promise<void>
	generateToken: () => Promise<string>
}

export const useRecaptcha = (): Recaptcha => {
	const loadScript = async (): Promise<void> => {
		if (window.grecaptcha) {
			return
		}

		try {
			await new Promise((resolve, reject) => {
				const script = document.createElement('script')
				script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`
				script.async = true
				script.defer = true
				script.onload = () => {
					resolve('recaptcha loaded')
				}
				script.onerror = () => {
					reject('recaptcha failed to load')
				}
				document.head.appendChild(script)
			})
		} catch (error) {
			if (typeof error === 'string') {
				throw new Error(error)
			}
			throw new Error('Unknown error. Recaptcha failed to load')
		}
	}

	const generateToken = async (): Promise<string> => {
		try {
			return await new Promise((resolve, reject) => {
				window.grecaptcha.ready(() => {
					window.grecaptcha
						.execute(RECAPTCHA_SITE_KEY, { action: 'submit' })
						.then((token) => {
							resolve(token)
						})
						.catch(reject)
				})
			})
		} catch (error) {
			if (typeof error === 'string') {
				throw new Error(error)
			}
			throw new Error('Unknown error. Recaptcha failed to generate token')
		}
	}

	return { loadScript, generateToken }
}
