import { Injectable, Inject } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { JwtService } from '@nestjs/jwt'
import { User } from '../user/model/user.model'

interface OauthProfile {
	id: string
	displayName: string
	emails: Array<{ value: string }>
}

type Strategy = 'google' | 'github'

@Injectable()
export class AuthService {
	@InjectModel(User) private userModel: typeof User
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

	login(user: User) {
		const payload = { sub: user.id, username: user.name }

		const accessToken = this.jwtService.sign(payload, {
			expiresIn: '1h',
		})

		return {
			accessToken,
			user: {
				name: user.name,
				email: user.email,
			},
		}
	}
}
