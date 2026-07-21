import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { corsMiddleware } from '@/adapters/primary/http/middlewares/cors.middleware.ts'
import { routesInternal } from '@/adapters/primary/http/routes/internal.route.ts'
import { routesShortUrl } from '@/adapters/primary/http/routes/shorturl.route.ts'
import dotenv from 'dotenv'
import express, { type Request, type Response } from 'express'

import { errorHandler } from '@/adapters/primary/http/middlewares/errorHandler.middleware.ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(express.json())
app.use(corsMiddleware())
app.disable('x-powered-by')

// Habilitar trust proxy
app.set('trust proxy', true)

// Configuración de dotenv apuntando a la raíz del servicio
const envPath = path.join(__dirname, '../.env')
dotenv.config({ path: envPath })

// Routes
app.use('/', routesShortUrl)
app.use('/internal', routesInternal)

app.get('/', (req: Request, res: Response) => {
	console.log(`IP del cliente: ${req.ip}`)
	res.redirect('https://min-url.com')
})

// favicon
app.get('/favicon.ico', (_req: Request, res: Response) => {
	res.status(204).end()
})

// Errores centralizados
app.use(errorHandler)

export { app }
