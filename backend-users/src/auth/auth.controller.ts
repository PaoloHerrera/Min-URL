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
	async googleCallback(
		@Request() req: ExpressRequest & { user?: User },
		@Response() res: ExpressResponse,
	) {
		if (!req.user) {
			return res.status(401).json({ message: 'Authentication failed' })
		}

		const { accessToken, refreshToken } = await this.authService.login(req.user)

		return res
			.cookie('min_url_access_token', accessToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict',
				maxAge: 1000 * 60 * 30, // Duracion de 30 minutos
			})
			.cookie('min_url_refresh_token', refreshToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict',
				maxAge: 1000 * 60 * 60 * 24 * 7, // Duracion de 7 dias
				path: '/auth/refresh',
			})

			.redirect(process.env.DASHBOARD_URL as string)
	}

	@Get('refresh')
	async refreshToken(
		@Request() req: ExpressRequest,
		@Response() res: ExpressResponse,
	) {
		const cookieName = 'min_url_refresh_token'

		const refreshToken = req.cookies[cookieName]

		if (!refreshToken) {
			return res.status(401).json({ message: 'Authentication failed' })
		}

		try {
			const { userId, username } =
				await this.authService.verifyRefreshToken(refreshToken)

			//Si el refresh token es válido se genera un nuevo access token
			const accessToken = await this.authService.generateNewAccessToken({
				userId,
				username,
				refreshToken,
			})

			return res
				.cookie('min_url_access_token', accessToken, {
					httpOnly: true,
					secure: process.env.NODE_ENV === 'production',
					sameSite: 'strict',
					maxAge: 1000 * 60 * 30, // Duracion de 30 minutos
				})
				.status(200)
				.json({ username })
		} catch (_error) {
			console.log('Error refreshing token')
			return res.status(401).json({ message: 'Authentication failed' })
		}
	}
}
