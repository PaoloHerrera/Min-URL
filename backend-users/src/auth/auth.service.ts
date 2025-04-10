import { Injectable, Inject } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { JwtService } from '@nestjs/jwt'
import { User } from '../user/model/user.model'
import { RefreshToken } from '../refreshToken/model/refreshToken.model'

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
	@InjectModel(User) private userModel: typeof User
	@InjectModel(RefreshToken) private refreshTokenModel: typeof RefreshToken
	@Inject(JwtService) private jwtService: JwtService

	constructor(jwtService: JwtService) {
		this.jwtService = jwtService
	}

	async validateUser(profile: OauthProfile, strategy: Strategy) {
		if (!(profile?.id && profile?.displayName && profile?.emails)) {
			throw new Error('Invalid profile data')
		}

		const strategyId = strategy === 'google' ? 'googleId' : 'githubId'

		const user = await this.userModel.findOne({
			where: { [strategyId]: profile.id },
		})

		if (!user) {
			const { id, displayName, name, emails, photos } = profile
			const email = emails?.[0]?.value
			const avatar = photos?.[0]?.value
			const { familyName, givenName } = name

			const newUser = this.userModel.build()
			newUser[strategyId] = id
			newUser.displayName = displayName
			newUser.givenName = givenName
			newUser.familyName = familyName
			newUser.email = email
			newUser.avatar = avatar

			await newUser.validate()
			await newUser.save()
			return newUser
		}
		await user.update({ updatedAt: new Date() })
		return user
	}

	async login(user: User) {
		const payload = { sub: user.idUsers, username: user.displayName }

		const accessToken = await this.jwtService.signAsync(payload, {
			expiresIn: '1d',
		})

		const refreshToken = await this.jwtService.signAsync(payload, {
			secret: process.env.REFRESH_TOKEN_SECRET,
			expiresIn: '7d',
		})

		//Se busca si existe un refresh token para el usuario
		const refreshData = await this.refreshTokenModel.findOne({
			where: { userId: user.idUsers, expired: false },
		})
		// Se marcan los refresh tokens como expirados
		if (refreshData) {
			await refreshData.update({
				expired: true,
				expiredAt: new Date(),
				updatedAt: new Date(),
			})
		}

		const newRefreshToken = this.refreshTokenModel.build()
		newRefreshToken.userId = user.idUsers
		newRefreshToken.refreshToken = refreshToken
		newRefreshToken.expiresAt = new Date(
			new Date().setDate(new Date().getDate() + 7),
		)
		newRefreshToken.validate()
		newRefreshToken.save()

		return {
			accessToken,
			refreshToken,
		}
	}

	async verifyRefreshToken(token: string) {
		const { sub, username } = await this.jwtService.verifyAsync(token, {
			secret: process.env.REFRESH_TOKEN_SECRET,
		})
		return { userId: sub, username }
	}

	async generateNewAccessToken({
		userId,
		username,
		refreshToken,
	}: { userId: number; username: string; refreshToken: string }) {
		const refresh = await this.refreshTokenModel.findOne({
			where: { userId, refreshToken },
		})

		if (!refresh) {
			console.log('Refresh token no encontrado')
			throw new Error('Refresh token not found')
		}

		if (refresh.expired) {
			console.log('Refresh token expirado')
			throw new Error('Refresh token expired')
		}

		const payload = { sub: userId, username }

		const accessToken = await this.jwtService.signAsync(payload, {
			expiresIn: '1d',
		})

		return accessToken
	}
}
