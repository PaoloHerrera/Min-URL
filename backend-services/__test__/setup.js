import dotenv from 'dotenv'

// Carga las variables de entorno de pruebas en el proceso de cada test worker de Vitest
dotenv.config({ path: '.env.test' })
