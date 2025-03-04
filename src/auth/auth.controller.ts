import { Controller, Get, UseGuards, Request, Response } from '@nestjs/common'
import type {
	Response as ExpressResponse,
	Request as ExpressRequest,
} from 'express'
import { AuthGuard } from '@nestjs/passport'
import type { User } from '../user/user.model'
import type { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
	private authService: AuthService
	constructor(authService: AuthService) {
		this.authService = authService
	}

	@Get('google')
	@UseGuards(AuthGuard('google'))
	googleLogin() {
		return 'ok'
	}

	@Get('google/callback')
	@UseGuards(AuthGuard('google'))
	async googleCallback(
		@Request() req: ExpressRequest & { user?: User },
		@Response() res: ExpressResponse,
	) {
		if (!req.user) {
			return res.status(401).json({ message: 'Authentication failed' })
		}

		const { accessToken, refreshToken, user } = await this.authService.login(
			req.user,
		)

		return {
			accessToken,
			refreshToken,
			user,
		}
	}
}
