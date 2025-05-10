import { Module } from '@nestjs/common'
import { ProtectedService } from './protected.service'
import { ProtectedController } from './protected.controller'
import { JwtStrategy } from '@/auth/strategies/jwt.strategy'
import { User } from '../user/model/user.model'
import { SequelizeModule } from '@nestjs/sequelize'
import { APP_GUARD } from '@nestjs/core'
import { ThrottlerGuard } from '@nestjs/throttler'

@Module({
	imports: [SequelizeModule.forFeature([User])],
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
