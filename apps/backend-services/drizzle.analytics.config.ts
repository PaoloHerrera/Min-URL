import type { Config } from 'drizzle-kit'

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
	throw new Error(
		'[ENV] DATABASE_URL is not defined. ' +
			'Set it in your .env file before running migrations.',
	)
}

export default {
	schema: './src/adapters/secondary/db/schema/visits.schema.ts',
	out: './db/migrations/analytics',
	dialect: 'postgresql',
	dbCredentials: {
		url: databaseUrl,
	},
} satisfies Config
