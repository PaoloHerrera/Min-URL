import type { ShortUrl } from '../domain/entities/ShortUrl.entity.ts'

export interface UrlRepository {
	save(shortUrl: ShortUrl): Promise<void>

	isSlugAvailable: (slug: string) => Promise<boolean>

	getUrlBySlug: (slug: string) => Promise<ShortUrl | null>
}
