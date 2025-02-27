import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { PassportModule } from '@nestjs/passport'
import { GoogleStrategy } from './google.strategy'
import { User } from './user.model'
import { SequelizeModule } from '@nestjs/sequelize'

@Module({
	imports: [PassportModule, SequelizeModule.forFeature([User])],
	providers: [AuthService, GoogleStrategy],
	controllers: [AuthController],
})
export class AuthModule {}
