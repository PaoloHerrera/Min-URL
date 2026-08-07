import { buildApp } from '@/app.ts'
import { createDbConnection } from '@/adapters/secondary/db/connection.ts'
import { parseEnv } from '@/config/env.ts'

export function createTestApp() {
	const env = parseEnv(process.env)
	const db = createDbConnection(env.DATABASE_URL)
	const app = buildApp(env, db)

	return { app, db, env }
}
