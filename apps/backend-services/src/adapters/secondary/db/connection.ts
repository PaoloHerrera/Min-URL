import { env } from '@/config/env.ts'
import { drizzle } from 'drizzle-orm/node-postgres'
import pg from 'pg'
import { shortUrls } from './schema/short-urls.schema.ts'
import { visits } from './schema/visits.schema.ts'

const pool = new pg.Pool({
	connectionString: env.DATABASE_URL,
})

export const db = drizzle(pool, { schema: { shortUrls, visits } })
