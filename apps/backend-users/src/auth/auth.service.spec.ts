import { getModelToken } from '@nestjs/sequelize'
import { Test, type TestingModule } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'
import { User } from '../user/model/user.model'
import { RefreshToken } from '../refreshToken/model/refreshToken.model'
import { AuthService } from './auth.service'

describe('AuthService', () => {
	let service: AuthService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				{
					provide: getModelToken(User),
					useValue: {
						findOne: jest.fn(),
						build: jest.fn(),
					},
				},
				{
					provide: getModelToken(RefreshToken),
					useValue: {
						findOne: jest.fn(),
						build: jest.fn(),
					},
				},
				{
					provide: JwtService,
					useValue: {
						signAsync: jest.fn(),
						verifyAsync: jest.fn(),
					},
				},
			],
		}).compile()

		service = module.get<AuthService>(AuthService)
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
	})
})
