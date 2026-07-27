import type { GeolocationProps } from '@/core/domain/value-objects/geolocation/Geolocation.vo.ts'
import { jsonb, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { shortUrls } from './short-urls.schema.ts'

export const visits = pgTable('visits', {
	id: uuid('id').defaultRandom().primaryKey(),
	shortUrlId: uuid('short_url_id')
		.references(() => shortUrls.id, { onDelete: 'cascade' })
		.notNull(),
	ipAddress: varchar('ip_address', { length: 45 }).notNull(),
	userAgent: varchar('user_agent', { length: 512 }).notNull(),
	referer: varchar('referer', { length: 2048 }).notNull(),
	refererDomain: varchar('referer_domain', { length: 255 }).notNull(),
	browser: varchar('browser', { length: 50 }).notNull(),
	os: varchar('os', { length: 50 }).notNull(),
	device: varchar('device', { length: 50 }).notNull(),
	geolocation: jsonb('geolocation').$type<GeolocationProps>(),
	visitedAt: timestamp('visited_at', { withTimezone: true })
		.defaultNow()
		.notNull(),
})
