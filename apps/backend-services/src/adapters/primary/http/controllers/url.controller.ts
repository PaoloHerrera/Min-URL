import type { Request, Response } from 'express'
import type { ResolveSlugRedirectUseCase } from '../../../../core/usecases/resolveSlugRedirect.usecase.ts'
import type { ShortenUrlAnonymousUseCase } from '../../../../core/usecases/shortenUrlAnonymous.usecase.ts'

export class UrlController {
	private readonly shortenUrlAnonymousUseCase: ShortenUrlAnonymousUseCase
	private readonly resolveSlugRedirectUseCase: ResolveSlugRedirectUseCase

	constructor(
		shortenUrlAnonymousUseCase: ShortenUrlAnonymousUseCase,
		resolveSlugRedirectUseCase: ResolveSlugRedirectUseCase,
	) {
		this.shortenUrlAnonymousUseCase = shortenUrlAnonymousUseCase
		this.resolveSlugRedirectUseCase = resolveSlugRedirectUseCase
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

	public resolveRedirect = async (
		req: Request<{ slug: string }>,
		res: Response,
	): Promise<void> => {
		try {
			const { slug } = req.params
			const output = await this.resolveSlugRedirectUseCase.execute({ slug })

			if (!output) {
				res.status(404).json({
					message: 'Slug not found',
				})
				return
			}

			res.status(200).json(output)
		} catch (error) {
			console.error('UrlController Error:', error)
			res.status(500).json({
				message: (error as Error).message,
			})
		}
	}
}
