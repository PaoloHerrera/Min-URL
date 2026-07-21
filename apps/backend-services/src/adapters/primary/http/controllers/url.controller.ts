import type { ShortenUrlAnonymous } from '@/core/usecases/ShortenUrlAnonymous.usecase.ts'
import type { VisitShortUrl } from '@/core/usecases/VisitShortUrl.usecase.ts'
import type { Request, Response } from 'express'

export class UrlController {
	private readonly shortenUrlAnonymousUseCase: ShortenUrlAnonymous
	private readonly visitShortUrlUseCase: VisitShortUrl

	constructor(
		shortenUrlAnonymousUseCase: ShortenUrlAnonymous,
		visitShortUrlUseCase: VisitShortUrl,
	) {
		this.shortenUrlAnonymousUseCase = shortenUrlAnonymousUseCase
		this.visitShortUrlUseCase = visitShortUrlUseCase
	}

	public createAnonymous = async (
		req: Request,
		res: Response,
	): Promise<void> => {
		const { originalUrl, captchaToken, turnstileToken } = req.body

		const clientIp =
			req.body.ip ||
			req.headers['x-forwarded-for'] ||
			req.socket.remoteAddress ||
			'unknown'

		const shortUrl = await this.shortenUrlAnonymousUseCase.execute({
			originalUrl,
			captchaToken: captchaToken || turnstileToken,
			clientIp,
		})

		res.status(200).json({
			originalUrl: shortUrl.originalUrl.value,
			shortUrl: `${process.env.REDIRECTOR_URL || 'https://murl.cl'}/${shortUrl.slug.value}`,
			slug: shortUrl.slug.value,
			createdAt: shortUrl.createdAt,
		})
	}

	public resolveRedirect = async (
		req: Request<{ slug: string }>,
		res: Response,
	): Promise<void> => {
		const { slug } = req.params
		const output = await this.visitShortUrlUseCase.execute({ slug })

		res.status(200).json(output)
	}
}
