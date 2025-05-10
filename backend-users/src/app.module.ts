import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { User } from './user/model/user.model'
import { RefreshToken } from './refreshToken/model/refreshToken.model'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { ProtectedModule } from './protected/protected.module'
import { HttpExceptionFilter } from './http-exception/http-exception.filter'
import { ThrottlerModule } from '@nestjs/throttler'

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
