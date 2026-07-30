import { defineConfig } from 'vitest/config'

// biome-ignore lint/style/noDefaultExport: Vitest expects a default export
export default defineConfig({
	test: {
		setupFiles: ['./__test__/setup.ts'],
	},
})
