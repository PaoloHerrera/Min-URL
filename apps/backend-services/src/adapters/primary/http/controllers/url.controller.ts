import { env } from '@/config/env.ts'
import type { ShortenUrlAnonymousPort } from '@/core/ports/inbound/ShortenUrlAnonymousPort.interface.ts'
import type { VisitShortUrlPort } from '@/core/ports/inbound/VisitShortUrlPort.interface.ts'
import type {
	ShortenAnonymousRequest,
	ShortenAnonymousResponse,
	SlugDataResponse,
} from '@min-url/contracts/dto'
import type { Request, Response } from 'express'
import { extractClientIp } from '../utils/extractClientIp.ts'

export class UrlController {
	private readonly shortenUrlAnonymousPort: ShortenUrlAnonymousPort
	private readonly visitShortUrlPort: VisitShortUrlPort

	constructor(
		shortenUrlAnonymousPort: ShortenUrlAnonymousPort,
		visitShortUrlPort: VisitShortUrlPort,
	) {
		this.shortenUrlAnonymousPort = shortenUrlAnonymousPort
		this.visitShortUrlPort = visitShortUrlPort
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

		const clientIp = extractClientIp(
			req.headers['x-forwarded-for'],
			req.socket.remoteAddress,
		)

		const shortUrl = await this.shortenUrlAnonymousPort.execute({
			originalUrl,
			captchaToken: captchaToken ?? turnstileToken ?? '',
			clientIp,
		})

		const response: ShortenAnonymousResponse = {
			originalUrl: shortUrl.originalUrl.value,
			shortUrl: `${env.REDIRECTOR_URL || 'https://murl.cl'}/${shortUrl.slug.value}`,
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
		const ipAddress = extractClientIp(
			req.headers['x-forwarded-for'],
			req.socket.remoteAddress,
		)
		const userAgent = req.get('user-agent')
		const referer = req.get('referer') || req.get('referrer')

		const shortUrl = await this.visitShortUrlPort.execute({
			slug,
			ipAddress,
			userAgent,
			referer,
		})

		const response: SlugDataResponse = {
			slug: shortUrl.slug.value,
			originalUrl: shortUrl.originalUrl.value,
			queryAt: new Date().toISOString(),
		}

		res.status(200).json(response)
	}
}
