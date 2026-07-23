import { JwtStrategy } from '@/auth/strategies/jwt.strategy'
import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { ThrottlerGuard } from '@nestjs/throttler'
import { ProtectedController } from './protected.controller'
import { ProtectedService } from './protected.service'

@Module({
	providers: [
		ProtectedService,
		JwtStrategy,
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		},
	],
	controllers: [ProtectedController],
})
export class ProtectedModule {}
