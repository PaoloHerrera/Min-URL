import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { User } from './user.model'
import type { OauthProfile, Strategy } from '../types.d.ts'

@Injectable()
export class AuthService {
	@InjectModel(User) private userModel: typeof User

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
}
