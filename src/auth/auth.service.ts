import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import type { JwtService } from '@nestjs/jwt'
import { User } from '../user/user.model'
import { RefreshToken } from '../refreshToken/refreshToken.model'
import type { OauthProfile, Strategy } from '../types.d.ts'

@Injectable()
export class AuthService {
	@InjectModel(User) private userModel: typeof User
	@InjectModel(RefreshToken) private refreshTokenModel: typeof RefreshToken
	private jwtService: JwtService

	async validateUser(
		profile: OauthProfile,
		strategy: Strategy,
	): Promise<User | null> {
		if (!(profile?.id && profile?.displayName && profile?.emails)) {
			throw new Error('Invalid profile data')
		}

		const strategyId = strategy === 'google' ? 'googleId' : 'githubId'

		const user = await this.userModel.findOne({
			where: { [strategyId]: profile.id },
		})

		if (!user) {
			const { id, displayName, emails } = profile
			const email = emails?.[0]?.value

			const newUser = this.userModel.build()
			newUser[strategyId] = id
			newUser.name = displayName
			newUser.email = email

			await newUser.validate()
			await newUser.save()
			return newUser
		}
		await user.update({ updatedAt: new Date() })
		return user
	}

	async login(user: User) {
		const payload = { sub: user.id, username: user.name }

		const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' })
		const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d' })

		const refresh = this.refreshTokenModel.build()
		refresh.userId = user.id
		refresh.refreshToken = refreshToken
		refresh.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
		await refresh.validate()
		await refresh.save()

		return {
			accessToken,
			refreshToken,
			user: {
				name: user.name,
				email: user.email,
			},
		}
	}

	async refreshToken(refreshToken: string) {
		try {
			const payload = this.jwtService.verify(refreshToken)
			const refresh = await this.refreshTokenModel.findOne({
				where: { userId: payload.sub, refreshToken },
			})
			if (!refresh) {
				throw new Error('Refresh token not found')
			}
			if (refresh.expired) {
				throw new Error('Refresh token expired')
			}

			const newAccessToken = this.jwtService.sign(payload, { expiresIn: '1h' })

			return {
				accessToken: newAccessToken,
				refreshToken: refresh.refreshToken,
			}
		} catch (_error) {
			throw new Error('Refresh token expired')
		}
	}
}
