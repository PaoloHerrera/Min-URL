import { createDbConnection } from '@/adapters/secondary/db/connection.ts'
import { parseEnv } from '@/config/env.ts'
import { loadEnv } from '@/config/loadEnv.ts'
import { buildApp } from './app.ts'

loadEnv()

const env = parseEnv(process.env)
const PORT = env.PORT
const db = createDbConnection(env.DATABASE_URL)
const app = buildApp(env, db)

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
