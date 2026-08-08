import { DatabaseConnectionError } from '@/adapters/errors/infra.errors.ts'
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

export const assertDatabaseAvailable = async (db: Db) => {
	try {
		await db.execute('SELECT 1')
	} catch {
		const error = new DatabaseConnectionError()
		console.error(
			`[FATAL] ${error.message} — Is docker compose up -d running? Check DATABASE_URL.`,
		)
		await db.close()
		process.exit(1)
	}
}
