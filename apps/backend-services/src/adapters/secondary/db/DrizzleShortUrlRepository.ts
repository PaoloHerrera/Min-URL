import { db } from '@/adapters/secondary/db/connection.ts'
import {
	toDomain,
	toPersistence,
} from '@/adapters/secondary/db/mappers/short-url.mapper.ts'
import { shortUrls } from '@/adapters/secondary/db/schema/short-urls.schema.ts'
import type { ShortUrl } from '@/core/domain/entities/ShortUrl.entity.ts'
import { SlugAlreadyExistsError } from '@/core/domain/errors/domain.errors'
import type { ShortUrlRepositoryPort } from '@/core/ports/outbound/ShortUrlRepositoryPort.interface.ts'
import { count, eq } from 'drizzle-orm'
import { DrizzleQueryError } from 'drizzle-orm/errors'
import { DatabaseError } from 'pg'

export class DrizzleShortUrlRepository implements ShortUrlRepositoryPort {
	async isSlugAvailable(slug: string): Promise<boolean> {
		const [result] = await db
			.select({ count: count() })
			.from(shortUrls)
			.where(eq(shortUrls.slug, slug))
		return result.count === 0
	}

	async save(shortUrl: ShortUrl): Promise<void> {
		const data = toPersistence(shortUrl)
		// clicksCount is excluded from updates — it is maintained atomically
		// by DrizzleVisitRepository.save() via clicks_count = clicks_count + 1.
		const { clicksCount: _omit, ...updateData } = data

		try {
			await db
				.insert(shortUrls)
				.values(data)
				.onConflictDoUpdate({ target: shortUrls.id, set: updateData })
		} catch (error) {
			if (
				error instanceof DrizzleQueryError &&
				error.cause instanceof DatabaseError &&
				error.cause.code === '23505' &&
				error.cause.constraint === 'short_urls_slug_unique'
			) {
				console.error(
					`Slug collision for ${data.slug}. Retrying with a different slug...`,
				)

				throw new SlugAlreadyExistsError(data.slug)
			}
			throw error
		}
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
