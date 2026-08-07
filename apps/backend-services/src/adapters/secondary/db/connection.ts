import { drizzle } from 'drizzle-orm/node-postgres'
import pg from 'pg'
import { shortUrls } from './schema/short-urls.schema.ts'
import { visits } from './schema/visits.schema.ts'

export const createDbConnection = (databaseUrl: string) => {
	const pool = new pg.Pool({
		connectionString: databaseUrl,
	})

	const db = drizzle(pool, { schema: { shortUrls, visits } })

	return Object.assign(db, { close: () => pool.end() })
}

export type Db = ReturnType<typeof createDbConnection>
