import path from 'path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'
import pg from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../.env.test'), override: true })

let migrated = false

export async function setup() {
	if (migrated) return

	const TEST_URL = process.env.DATABASE_URL!
	const ADMIN_URL = process.env.ADMIN_URL!

	// 1. Recreate test database
	const admin = new pg.Client({ connectionString: ADMIN_URL })
	await admin.connect()
	try {
		await admin.query('DROP DATABASE IF EXISTS min_url_test WITH (FORCE)')
		await admin.query('CREATE DATABASE min_url_test')
	} finally {
		await admin.end()
	}

	// 2. Apply core migrations (short_urls) directly via drizzle migrator.
	// Using the programmatic API avoids drizzle-kit CLI auto-loading .env,
	// which would override DATABASE_URL with the dev database URL.
	const corePool = new pg.Pool({ connectionString: TEST_URL })
	const coreDb = drizzle(corePool)
	await migrate(coreDb, {
		migrationsFolder: path.resolve(__dirname, '../db/migrations/core'),
		migrationsTable: 'drizzle_migrations_core',
	})
	await corePool.end()

	// 3. Apply analytics migrations (visits) directly via drizzle migrator.
	const analyticsPool = new pg.Pool({ connectionString: TEST_URL })
	const analyticsDb = drizzle(analyticsPool)
	await migrate(analyticsDb, {
		migrationsFolder: path.resolve(__dirname, '../db/migrations/analytics'),
		migrationsTable: 'drizzle_migrations_analytics',
	})
	await analyticsPool.end()

	migrated = true
}
