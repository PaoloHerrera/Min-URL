import {
	vi,
	describe,
	it,
	expect,
	beforeEach,
	beforeAll,
	afterAll,
} from 'vitest'
import {
	assertDatabaseAvailable,
	type Db,
} from '@/adapters/secondary/db/connection.ts'

const db = { execute: vi.fn(), close: vi.fn() }

beforeAll(() => {
	vi.spyOn(process, 'exit').mockImplementation(() => undefined as never)
	vi.spyOn(console, 'error').mockImplementation(() => {})
})

beforeEach(() => {
	vi.clearAllMocks()
})

afterAll(() => {
	vi.restoreAllMocks()
})

describe('assertDatabaseAvailable unit test', () => {
	it('Should execute SELECT 1 query and not throw any error if database is available', async () => {
		db.execute.mockResolvedValue([{ 1: 1 }])
		await assertDatabaseAvailable(db as unknown as Db)
		expect(db.execute).toHaveBeenCalledWith('SELECT 1')
		expect(db.close).not.toHaveBeenCalled()
		expect(process.exit).not.toHaveBeenCalled()
	})

	it('Should log and exit with code 1 when database is unavailable', async () => {
		db.execute.mockRejectedValue(new Error('Database connection failed'))
		db.close.mockResolvedValue(undefined)
		await assertDatabaseAvailable(db as unknown as Db)

		expect(db.close).toHaveBeenCalled()
		expect(process.exit).toHaveBeenCalledTimes(1)
		expect(console.error).toHaveBeenNthCalledWith(
			1,
			expect.stringContaining('DATABASE_URL'),
		)
		expect(console.error).toHaveBeenCalledTimes(1)
	})

	it('Should print failed to close error message when db.close() fails', async () => {
		db.execute.mockRejectedValue(new Error('Database connection failed'))
		db.close.mockRejectedValue(new Error('Failed to close the database pool'))
		await assertDatabaseAvailable(db as unknown as Db)
		expect(db.close).toHaveBeenCalled()
		expect(console.error).toHaveBeenNthCalledWith(
			1,
			expect.stringContaining('DATABASE_URL'),
		)
		expect(console.error).toHaveBeenNthCalledWith(
			2,
			expect.stringContaining('Failed to close the database pool'),
		)
		expect(console.error).toHaveBeenCalledTimes(2)
		expect(process.exit).toHaveBeenCalledTimes(1)
	})
})
