import type { CaptchaServices } from '@/core/ports/CaptchaServices.interface.ts'
import axios from 'axios'

export class TurnstileCaptchaService implements CaptchaServices {
	private readonly secretKey: string

	constructor() {
		this.secretKey = process.env.TURNSTILE_SECRET_KEY as string
	}

	public async verify(token: string): Promise<boolean> {
		try {
			const response = await axios.post(
				'https://challenges.cloudflare.com/turnstile/v0/siteverify',
				{
					secret: this.secretKey,
					response: token,
				},
				{ timeout: 5000 },
			)
			return response.data.success
		} catch (error) {
			console.error('Turnstile Captcha API communication failure:', error)
			throw error
		}
	}
}
