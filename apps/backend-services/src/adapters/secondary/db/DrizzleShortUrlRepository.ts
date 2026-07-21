import { db } from '@/adapters/secondary/db/connection.ts'
import {
	toDomain,
	toPersistence,
} from '@/adapters/secondary/db/mappers/short-url.mapper.ts'
import { shortUrls } from '@/adapters/secondary/db/schema/short-urls.schema.ts'
import type { ShortUrl } from '@/core/domain/entities/ShortUrl.entity.ts'
import type { ShortUrlRepository } from '@/core/ports/ShortUrlRepository.interface.ts'
import { count, eq } from 'drizzle-orm'

export class DrizzleShortUrlRepository implements ShortUrlRepository {
	async isSlugAvailable(slug: string): Promise<boolean> {
		const [result] = await db
			.select({ count: count() })
			.from(shortUrls)
			.where(eq(shortUrls.slug, slug))
		return result.count === 0
	}

	async save(shortUrl: ShortUrl): Promise<void> {
		const data = toPersistence(shortUrl)
		await db
			.insert(shortUrls)
			.values(data)
			.onConflictDoUpdate({ target: shortUrls.id, set: data })
	}

	async getUrlBySlug(slug: string): Promise<ShortUrl | null> {
		const [row] = await db
			.select()
			.from(shortUrls)
			.where(eq(shortUrls.slug, slug))
			.limit(1)
		if (!row) {
			return null
		}
		return toDomain(row)
	}
}
