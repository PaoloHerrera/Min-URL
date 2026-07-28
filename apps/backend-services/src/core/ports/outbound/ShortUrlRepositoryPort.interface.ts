import type { ShortUrl } from '@/core/domain/entities/ShortUrl.entity.ts'

export interface ShortUrlRepositoryPort {
	save(shortUrl: ShortUrl): Promise<void>
	isSlugAvailable(slug: string): Promise<boolean>
	getUrlBySlug(slug: string): Promise<ShortUrl | null>
}
