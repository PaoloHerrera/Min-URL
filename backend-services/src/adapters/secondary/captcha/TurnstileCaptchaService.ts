import axios from 'axios'
import type { CaptchaServices } from '../../../core/ports/CaptchaServices.interface.ts'

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
			)
			return response.data.success
		} catch (_error: unknown) {
			return false
		}
	}
}
