import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
	server: {
		port: 4000,
	},
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			'@': '/src',
		},
	},
})
