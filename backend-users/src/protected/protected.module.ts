import { Module } from '@nestjs/common'
import { ProtectedService } from './protected.service'
import { ProtectedController } from './protected.controller'
import { JwtStrategy } from '@/auth/strategies/jwt.strategy'
import { User } from '../user/model/user.model'
import { SequelizeModule } from '@nestjs/sequelize'

@Module({
	imports: [SequelizeModule.forFeature([User])],
	providers: [ProtectedService, JwtStrategy],
	controllers: [ProtectedController],
})
export class ProtectedModule {}
