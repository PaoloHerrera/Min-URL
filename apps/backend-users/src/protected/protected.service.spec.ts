import { getModelToken } from '@nestjs/sequelize'
import { Test, type TestingModule } from '@nestjs/testing'
import { User } from '../user/model/user.model'
import { ProtectedService } from './protected.service'

describe('ProtectedService', () => {
	let service: ProtectedService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ProtectedService,
				{
					provide: getModelToken(User),
					useValue: {
						findOne: jest.fn(),
						sequelize: { query: jest.fn() },
					},
				},
			],
		}).compile()

		service = module.get<ProtectedService>(ProtectedService)
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
	})
})
