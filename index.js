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

const envPath = path.join(__dirname, '.env')

// Configuración de dotenv
dotenv.config({ path: envPath })

// Routes
app.use('/api/urls', routesUrl)
app.use('/', routesShortUrl)

app.get('/', (req, res) => {
  res.send('Hello World')
})

// favicon
app.get('/favicon.ico', (req, res) => {
  return res.status(204).end()
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
