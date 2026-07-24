import type { ShortenUrlAnonymous } from '@/core/usecases/ShortenUrlAnonymous.usecase.ts'
import type { VisitShortUrl } from '@/core/usecases/VisitShortUrl.usecase.ts'
import type {
	ShortenAnonymousRequest,
	ShortenAnonymousResponse,
	SlugDataResponse,
} from '@min-url/contracts/dto'
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
		const {
			originalUrl,
			captchaToken,
			turnstileToken,
		}: ShortenAnonymousRequest = req.body

		const clientIp =
			req.body.ip ||
			req.headers['x-forwarded-for'] ||
			req.socket.remoteAddress ||
			'unknown'

		const shortUrl = await this.shortenUrlAnonymousUseCase.execute({
			originalUrl,
			captchaToken: captchaToken ?? turnstileToken ?? '',
			clientIp,
		})

		const response: ShortenAnonymousResponse = {
			originalUrl: shortUrl.originalUrl.value,
			shortUrl: `${process.env.REDIRECTOR_URL || 'https://murl.cl'}/${shortUrl.slug.value}`,
			slug: shortUrl.slug.value,
			createdAt: shortUrl.createdAt.toISOString(),
		}
		res.status(200).json(response)
	}

	public resolveRedirect = async (
		req: Request<{ slug: string }>,
		res: Response,
	): Promise<void> => {
		const { slug } = req.params
		const shortUrl = await this.visitShortUrlUseCase.execute({
			slug,
		})

		const response: SlugDataResponse = {
			slug: shortUrl.slug.value,
			password: !!shortUrl.passwordHash,
			queryAt: new Date().toISOString(),
		}

		if (!shortUrl.passwordHash) {
			response.originalUrl = shortUrl.originalUrl.value
		}

		res.status(200).json(response)
	}
}
