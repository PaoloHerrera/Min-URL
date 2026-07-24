import type { ShortUrl } from '@/core/domain/entities/ShortUrl.entity.ts'

export interface ShortenUrlAnonymousInput {
	originalUrl: string
	captchaToken: string
	clientIp: string
}

export interface ShortenUrlAnonymousPort {
	execute(input: ShortenUrlAnonymousInput): Promise<ShortUrl>
}
