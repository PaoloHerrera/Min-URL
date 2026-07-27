import type { Config } from 'drizzle-kit'

export default {
	schema: './src/adapters/secondary/db/schema/visits.schema.ts',
	out: './db/migrations/analytics',
	dialect: 'postgresql',
	dbCredentials: {
		url: process.env.DATABASE_URL ?? '',
	},
} satisfies Config
