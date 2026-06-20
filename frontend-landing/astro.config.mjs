import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

// https://astro.build/config
// biome-ignore lint/style/noDefaultExport: Astro require default export.
export default defineConfig({
	integrations: [react()],
	vite: {
		plugins: [tailwindcss()],
	},
})
