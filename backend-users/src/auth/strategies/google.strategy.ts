import { Strategy } from 'passport-google-oauth20'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import type { AuthService } from '../auth.service'
import type { User } from '../../user/model/user.model'

interface OauthProfile {
	id: string
	displayName: string
	emails: Array<{ value: string }>
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
	private authService: AuthService
	constructor(authService: AuthService) {
		super({
			clientID: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
			callbackURL: '/auth/google/callback',
			scope: ['profile', 'email'],
		})
		this.authService = authService
	}

	async validate(
		_accessToken: string,
		_refreshToken: string,
		profile: OauthProfile,
		done: (error: Error | null, user?: User | null) => void,
	) {
		try {
			const user = await this.authService.validateUser(profile, 'google')
			done(null, user)
		} catch (error) {
			done(error as Error, null)
		}
	}
}
