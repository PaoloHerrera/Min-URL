import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { GoogleStrategy } from './strategies/google.strategy'
import { JwtStrategy } from './strategies/jwt.strategy'

@Module({
	imports: [
		PassportModule,
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
		JwtStrategy,
	],
	controllers: [AuthController],
})
export class AuthModule {}
