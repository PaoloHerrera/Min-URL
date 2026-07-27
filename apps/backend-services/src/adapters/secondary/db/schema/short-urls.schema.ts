import type { GeolocationProps } from '@/core/domain/value-objects/geolocation/Geolocation.vo.ts'
import {
	integer,
	jsonb,
	pgTable,
	text,
	timestamp,
	uuid,
} from 'drizzle-orm/pg-core'

export const shortUrls = pgTable('short_urls', {
	id: uuid('id').defaultRandom().primaryKey(),
	slug: text('slug').unique().notNull(),
	originalUrl: text('original_url').notNull(),
	title: text('title').default('Untitled').notNull(),
	purpose: text('purpose', { enum: ['direct', 'qr', 'api'] })
		.default('direct')
		.notNull(),
	clicksCount: integer('clicks_count').default(0).notNull(),
	passwordHash: text('password_hash'),
	ipAddress: text('ip_address').notNull(),
	geolocation: jsonb('geolocation').$type<GeolocationProps>(),
	expirationDate: timestamp('expiration_date', { withTimezone: true }),
	expiredAt: timestamp('expired_at', { withTimezone: true }),
	createdAt: timestamp('created_at', { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true })
		.defaultNow()
		.notNull(),
	deletedAt: timestamp('deleted_at', { withTimezone: true }),
})
