import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { HttpExceptionFilter } from './http-exception/http-exception.filter'
import { ProtectedModule } from './protected/protected.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
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
