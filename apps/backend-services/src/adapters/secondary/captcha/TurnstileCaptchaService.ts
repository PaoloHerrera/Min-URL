import { env } from '@/config/env.ts'
import type { CaptchaServicePort } from '@/core/ports/outbound/CaptchaServicePort.interface.ts'
import axios from 'axios'
import { CaptchaServiceError } from '../errors/adapters.errors.ts'

export class TurnstileCaptchaService implements CaptchaServicePort {
	private readonly secretKey: string

	constructor() {
		this.secretKey = env.TURNSTILE_SECRET_KEY
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
			throw new CaptchaServiceError()
		}
	}
}
