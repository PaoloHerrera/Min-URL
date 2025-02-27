import { Controller, Get, UseGuards, Request, Response } from '@nestjs/common'
import type {
	Response as ExpressResponse,
	Request as ExpressRequest,
} from 'express'
import { AuthGuard } from '@nestjs/passport'
import type { User } from './user.model'

@Controller('auth')
export class AuthController {
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

		return res.redirect(process.env.DASHBOARD_URL || '/')
	}
}
