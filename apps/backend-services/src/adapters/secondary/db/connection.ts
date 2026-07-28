import { drizzle } from 'drizzle-orm/node-postgres'
import pg from 'pg'
import { shortUrls } from './schema/short-urls.schema.ts'
import { visits } from './schema/visits.schema.ts'

// Connection Pool using pg
const pool = new pg.Pool({
	connectionString: process.env.DATABASE_URL ?? '',
})

export const db = drizzle(pool, { schema: { shortUrls, visits } })
