import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import { ThrottlerModule } from '@nestjs/throttler'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { HttpExceptionFilter } from './http-exception/http-exception.filter'
import { ProtectedModule } from './protected/protected.module'
import { RefreshToken } from './refreshToken/model/refreshToken.model'
import { User } from './user/model/user.model'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		SequelizeModule.forRoot({
			dialect: 'postgres',
			host: process.env.DB_HOST,
			port: Number(process.env.DB_PORT),
			username: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME,
			models: [User, RefreshToken],
		}),
		AuthModule,
		ProtectedModule,
		ThrottlerModule.forRoot({
			throttlers: [
				{
					ttl: 60000,
					limit: 10,
				},
			],
		}),
	],
	controllers: [AppController],
	providers: [AppService, HttpExceptionFilter],
})
export class AppModule {}
