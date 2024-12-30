import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'node:path'

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: [
			{
				find: '@',
				replacement: path.resolve(path.join(__dirname, 'src')),
			},
			{
				find: '@components',
				replacement: path.resolve(path.join(__dirname, 'src/components')),
			},
			{
				find: '@hooks',
				replacement: path.resolve(path.join(__dirname, 'src/hooks')),
			},
			{
				find: '@assets',
				replacement: path.resolve(path.join(__dirname, 'src/assets')),
			},
			{
				find: '@context',
				replacement: path.resolve(path.join(__dirname, 'src/context')),
			},
			{
				find: '@pages',
				replacement: path.resolve(path.join(__dirname, 'src/pages')),
			},
			{
				find: '@utils',
				replacement: path.resolve(path.join(__dirname, 'src/utils')),
			},
			{
				find: '@reducers',
				replacement: path.resolve(path.join(__dirname, 'src/reducers')),
			},
			{
				find: '@services',
				replacement: path.resolve(path.join(__dirname, 'src/services')),
			},
		],
	},
})
