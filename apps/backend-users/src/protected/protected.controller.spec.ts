import { getModelToken } from '@nestjs/sequelize'
import { Test, type TestingModule } from '@nestjs/testing'
import { User } from '../user/model/user.model'
import { ProtectedController } from './protected.controller'
import { ProtectedService } from './protected.service'

describe('ProtectedController', () => {
	let controller: ProtectedController

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
			controllers: [ProtectedController],
		}).compile()

		controller = module.get<ProtectedController>(ProtectedController)
	})

	it('should be defined', () => {
		expect(controller).toBeDefined()
	})
})
