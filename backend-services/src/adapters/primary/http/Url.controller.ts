import type { Request, Response } from 'express'
import type { ShortenUrlAnonymousUseCase } from '../../../core/usecases/shortenUrlAnonymous.usecase.js'

export class UrlController {
	private readonly shortenUrlAnonymousUseCase: ShortenUrlAnonymousUseCase

	constructor(shortenUrlAnonymousUseCase: ShortenUrlAnonymousUseCase) {
		this.shortenUrlAnonymousUseCase = shortenUrlAnonymousUseCase
	}

	public createAnonymous = async (
		req: Request,
		res: Response,
	): Promise<void> => {
		try {
			const { originalUrl, captchaToken, turnstileToken } = req.body

			const clientIp =
				req.body.ip ||
				req.headers['x-forwarded-for'] ||
				req.socket.remoteAddress ||
				'unknown'

			const output = await this.shortenUrlAnonymousUseCase.execute({
				originalUrl,
				captchaToken: captchaToken || turnstileToken,
				clientIp,
			})

			res.status(200).json({
				originalUrl: output.originalUrl,
				purpose: output.purpose,
				shortUrl: `${process.env.REDIRECTOR_URL || 'https://murl.cl'}/${output.slug}`,
				slug: output.slug,
				createdAt: output.createdAt,
			})
		} catch (error) {
			console.error('UrlController Error:', error)
			res.status(500).json({
				message: (error as Error).message,
			})
		}
	}
}
