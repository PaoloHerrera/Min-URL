import { app } from './app.ts'

// Run the server!
try {
	await app.listen({ port: 3002 })
} catch (err) {
	app.log.error(err)
	process.exit(1)
}
