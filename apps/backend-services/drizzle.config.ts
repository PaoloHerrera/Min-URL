import type { Config } from 'drizzle-kit'

export default {
	schema: './src/adapters/secondary/db/schema/short-urls.schema.ts',
	out: './db/migrations/core',
	dialect: 'postgresql',
	dbCredentials: {
		url: process.env.DATABASE_URL ?? '',
	},
} satisfies Config
