import pg from 'pg'

const ADMIN_URL = 'postgres://admin:admin@localhost:5432/postgres'
const client = new pg.Client({ connectionString: ADMIN_URL })

try {
	await client.connect()
	await client.query('DROP DATABASE IF EXISTS min_url WITH (FORCE)')
	await client.query('CREATE DATABASE min_url')
	console.log('✅ Database min_url recreated')
} catch (error) {
	console.error(
		'❌ Failed to drop/recreate database:',
		(error as Error).message,
	)
	process.exit(1)
} finally {
	await client.end()
}
