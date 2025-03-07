import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { PassportModule } from '@nestjs/passport'
import { User } from '../user/model/user.model'
import { RefreshToken } from '../refreshToken/model/refreshToken.model'
import { SequelizeModule } from '@nestjs/sequelize'
import { GoogleStrategy } from './strategies/google.strategy'
import { AuthController } from './auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

@Module({
	imports: [
		PassportModule,
		SequelizeModule.forFeature([User, RefreshToken]),
		JwtModule.registerAsync({
			useFactory: async (configService: ConfigService) => ({
				secret: configService.get('JWT_SECRET'),
			}),
			inject: [ConfigService],
		}),
	],
	providers: [
		AuthService,
		{
			provide: GoogleStrategy,
			useFactory: (authService: AuthService) => new GoogleStrategy(authService),
			inject: [AuthService],
		},
	],
	controllers: [AuthController],
})
export class AuthModule {}
