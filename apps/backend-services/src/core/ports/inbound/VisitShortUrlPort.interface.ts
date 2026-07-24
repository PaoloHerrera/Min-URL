import type { ShortUrl } from '@/core/domain/entities/ShortUrl.entity.ts'

export interface VisitShortUrlInput {
	slug: string
}

export interface VisitShortUrlPort {
	execute(input: VisitShortUrlInput): Promise<ShortUrl>
}
