import {
	Controller,
	Get,
	Post,
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
import {
	ACCESS_TOKEN_COOKIE_NAME,
	REFRESH_TOKEN_COOKIE_NAME,
} from '@/constants'

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
			.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict',
				maxAge: 1000 * 60 * 60 * 24, // Duracion de 30 minutos //Por ahora es 24 horas
			})
			.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict',
				maxAge: 1000 * 60 * 60 * 24 * 7, // Duracion de 7 dias
			})

			.redirect(process.env.DASHBOARD_URL as string)
	}

	@Post('refresh')
	async refreshToken(
		@Request() req: ExpressRequest,
		@Response() res: ExpressResponse,
	) {
		const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME]

		if (!refreshToken) {
			console.log('No se encontro el refresh token')
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
				.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
					httpOnly: true,
					secure: process.env.NODE_ENV === 'production',
					sameSite: 'strict',
					maxAge: 1000 * 60 * 60 * 24, // Duracion de 30 minutos
				})
				.redirect(process.env.DASHBOARD_URL as string)
		} catch (_error) {
			console.log('Error refreshing token')
			return res.status(401).json({ message: 'Authentication failed' })
		}
	}

	@Get('logout')
	logout(@Request() _req: ExpressRequest, @Response() res: ExpressResponse) {
		res.clearCookie(ACCESS_TOKEN_COOKIE_NAME)
		res.clearCookie(REFRESH_TOKEN_COOKIE_NAME)
		return res.redirect(process.env.LOGIN_URL as string)
	}
}
