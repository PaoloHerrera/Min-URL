import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import cookieParser from 'cookie-parser'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	app.enableCors({
		origin: true,
		credentials: true,
	})
	app.use(cookieParser())

	const port = process.env.PORT || 3000
	console.log(`Server running on port ${port}`)
	await app.listen(port)
}
bootstrap()
