import {
	Controller,
	Get,
	UseGuards,
	Request,
	Response,
	Inject,
} from '@nestjs/common'
import type {
	Response as ExpressResponse,
	Request as ExpressRequest,
} from 'express'
import { AuthGuard } from '@nestjs/passport'
import type { User } from '../user/model/user.model'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
	@Inject(AuthService) private authService: AuthService
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
	googleCallback(
		@Request() req: ExpressRequest & { user?: User },
		@Response() res: ExpressResponse,
	) {
		if (!req.user) {
			return res.status(401).json({ message: 'Authentication failed' })
		}

		const { accessToken, user } = this.authService.login(req.user)

		return res
			.cookie('min_url_access_token', accessToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict',
				maxAge: 60 * 60 * 24 * 7,
			})
			.send({ user, accessToken })
	}
}
