import path from 'path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'
import { execSync } from 'node:child_process'
import pg from 'pg'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../.env.test') })

let migrated = false

export async function setup() {
	if (migrated) return

	const ADMIN_URL = process.env.ADMIN_URL
	const client = new pg.Client({ connectionString: ADMIN_URL })
	await client.connect()
	try {
		await client.query('DROP DATABASE IF EXISTS min_url_test WITH (FORCE)')
		await client.query('CREATE DATABASE min_url_test')
	} finally {
		await client.end()
	}

	execSync('bunx drizzle-kit migrate', {
		env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL! },
		stdio: 'pipe',
	})

	migrated = true
}
