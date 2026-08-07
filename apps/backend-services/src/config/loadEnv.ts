import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'

// Load local .env file only when running in non-production environments

export const loadEnv = () => {
	if (process.env.NODE_ENV !== 'production') {
		const __filename = fileURLToPath(import.meta.url)
		const __dirname = path.dirname(__filename)
		const envPath = path.join(__dirname, '../.env')

		dotenv.config({ path: envPath })
	}
}
