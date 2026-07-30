import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'
import { defineConfig } from 'vitest/config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '.env.test') })

// biome-ignore lint/style/noDefaultExport: Vitest expects a default export
export default defineConfig({
	test: {
		setupFiles: ['./__test__/setup.ts'],
	},
})
