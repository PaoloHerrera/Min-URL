import express from 'express'
import dotenv from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { corsMiddleware } from './middleware/cors.js'
import routesUrl from './routes/url.js'
import routesShortUrl from './routes/shorturl.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(express.json())
app.use(corsMiddleware())
app.disable('x-powered-by')

// Habilitar trust proxy
app.set('trust proxy', true)

const envPath = path.join(__dirname, '.env')

// Configuración de dotenv
dotenv.config({ path: envPath })

// Routes
app.use('/api/urls', routesUrl)
app.use('/', routesShortUrl)

app.get('/', (req, res) => {
	const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress

	// Si recibes una dirección IPv6, puedes intentar extraer la dirección IPv4
	const ipv4 = ip.includes(':') ? ip.split(',')[0].split(':').pop() : ip

	console.log(`CF-CONNECTING-IP: ${req.headers['cf-connecting-ip']}`)
	console.log(`X-Real-IP: ${req.headers['x-real-ip']}`)
	console.log(`X-Forwarded-For: ${req.headers['x-forwarded-for']}`)
	console.log(`Remote Address: ${req.socket.remoteAddress}`)

	console.log('IP del cliente:', ipv4)
	return res.redirect('https://min-url.com')
})

// favicon
app.get('/favicon.ico', (req, res) => {
	return res.status(204).end()
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
