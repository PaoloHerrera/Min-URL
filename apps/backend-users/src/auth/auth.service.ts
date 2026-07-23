import { Inject, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

interface OauthProfile {
	id: string
	displayName: string
	name: { familyName: string; givenName: string }
	emails: Array<{ value: string }>
	photos: Array<{ value: string }>
}

type Strategy = 'google' | 'github'

@Injectable()
export class AuthService {
	@Inject(JwtService) private jwtService: JwtService

	constructor(jwtService: JwtService) {
		this.jwtService = jwtService
	}

	async validateUser(profile: OauthProfile, _strategy: Strategy) {
		// TODO: Refactor with Drizzle / better-auth in Parte 1B
		if (!(profile?.id && profile?.displayName && profile?.emails)) {
			throw new Error('Invalid profile data')
		}
		await Promise.resolve()
		return {
			idUsers: 1,
			displayName: profile.displayName,
			email: profile.emails[0]?.value,
		}
	}

	async login(user: { idUsers: number; displayName: string }) {
		const payload = { sub: user.idUsers, username: user.displayName }

		const accessToken = await this.jwtService.signAsync(payload, {
			expiresIn: '1d',
		})

		const refreshToken = await this.jwtService.signAsync(payload, {
			secret: process.env.REFRESH_TOKEN_SECRET,
			expiresIn: '7d',
		})

		return {
			accessToken,
			refreshToken,
		}
	}

	async verifyRefreshToken(token: string) {
		const { sub, username } = await this.jwtService.verifyAsync(token, {
			secret: process.env.REFRESH_TOKEN_SECRET || 'secret',
		})
		return { userId: sub, username }
	}

	async generateNewAccessToken({
		userId,
		username,
	}: {
		userId: number
		username: string
		refreshToken: string
	}) {
		const payload = { sub: userId, username }
		return await this.jwtService.signAsync(payload, {
			expiresIn: '1d',
		})
	}
}
