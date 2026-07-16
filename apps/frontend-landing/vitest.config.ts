import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vitest/config'

// biome-ignore lint/style/noDefaultExport: Vitest require default export
export default defineConfig({
	plugins: [react()],
	test: {
		globals: true,
		environment: 'happy-dom',
		setupFiles: ['./src/test-setup.ts'],
		include: ['**/__test__/**/*.{test,spec}.{ts,tsx}'],
		coverage: {
			reporter: ['text', 'json', 'html'],
		},
	},
	resolve: {
		alias: {
			'@': '/src',
		},
	},
})
