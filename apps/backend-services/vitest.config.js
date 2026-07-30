import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'
import { defineConfig } from 'vitest/config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '.env.test') })

export default defineConfig({
	test: {
		include: ['__test__/unit/**/*.test.ts'],
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'@root': path.resolve(__dirname, '.'),
		},
	},
})
