import { JwtStrategy } from '@/auth/strategies/jwt.strategy'
import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { SequelizeModule } from '@nestjs/sequelize'
import { ThrottlerGuard } from '@nestjs/throttler'
import { User } from '../user/model/user.model'
import { ProtectedController } from './protected.controller'
import { ProtectedService } from './protected.service'

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
