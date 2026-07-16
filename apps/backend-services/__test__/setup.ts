import path from 'path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'

// Get the current file name and directory name
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load the environment variables from the test environment
dotenv.config({ path: path.resolve(__dirname, '../.env.test') })
