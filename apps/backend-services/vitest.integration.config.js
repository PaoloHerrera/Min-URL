import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
	test: {
		include: ['__test__/integration/**/*.test.ts'],
		globalSetup: ['./__test__/setup.ts'],
		env: {
			DATABASE_URL: 'postgres://admin:admin@localhost:5432/min_url_test',
		},
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'@root': path.resolve(__dirname, '.'),
		},
	},
})
