import express from 'express'
import dotenv from 'dotenv'
import path from 'node:path'
import session from 'express-session'
import { fileURLToPath } from 'node:url'
import { corsMiddleware } from './middleware/cors.js'
import { routesShortUrl } from './routes/shorturl.js'
import { protectedRouter } from './routes/protected.js'
import { setupRedis } from './config/redis.js'

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

//Redis
setupRedis()

// Routes

app.use('/', routesShortUrl)
app.use('/protected/', protectedRouter)

app.get('/', (req, res) => {
	console.log(`IP del cliente: ${req.ip}`)

	return res.redirect('https://min-url.com')
})

// favicon
app.get('/favicon.ico', (_req, res) => {
	return res.status(204).end()
})

// Errores
app.use((error, _req, res, _next) => {
	console.error(error)
	res
		.status(500)
		.json({ error: 'Internal Server Error', message: error.message })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
