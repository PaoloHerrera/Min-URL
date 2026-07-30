import type { Config } from 'drizzle-kit'
import { env } from './src/config/env.ts'

export default {
	schema: './src/adapters/secondary/db/schema/short-urls.schema.ts',
	out: './db/migrations/core',
	dialect: 'postgresql',
	dbCredentials: {
		url: env.DATABASE_URL,
	},
} satisfies Config
