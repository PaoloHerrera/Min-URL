import express from 'express'
import dotenv from 'dotenv'
import path from 'node:path'
import session from 'express-session'
import { fileURLToPath } from 'node:url'
import { corsMiddleware } from './middleware/cors.js'
import { routesUrl } from './routes/url.js'
import { routesShortUrl } from './routes/shorturl.js'
import { routesQrCode } from './routes/qrcode.js'
import { checkRouter } from './routes/check.js'

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

app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
	}),
)

// Routes
app.use('/direct/shorten', routesUrl)
app.use('/qr/qrcode', routesQrCode)
app.use('/', routesShortUrl)
app.use('/check/', checkRouter)

app.get('/', (req, res) => {
	console.log(`IP del cliente: ${req.ip}`)

	return res.redirect('https://min-url.com')
})

// favicon
app.get('/favicon.ico', (_req, res) => {
	return res.status(204).end()
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
