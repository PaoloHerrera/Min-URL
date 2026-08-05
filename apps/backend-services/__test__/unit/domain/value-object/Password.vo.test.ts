import { describe, expect, it } from 'vitest'
import { Password } from '@/core/domain/value-objects/password/Password.vo.ts'

describe('Password Value Object', () => {
	it.each([
		['123456', '6-digit password'],
		['mysecretpassword', 'Longer password'],
		['Pa$$w0rd', 'Password with symbols'],
	])('Should create Password for a valid password - %s (%s)', (password) => {
		const passwordVo = Password.create(password)
		expect(passwordVo.hash).not.toBeUndefined()
		expect(passwordVo.hash).not.toBeNull()
		expect(passwordVo.hash).not.toBe('')
		expect(passwordVo.hash).not.toBe('undefined')
		expect(passwordVo.hash).not.toBe('null')
		expect(passwordVo.hash).not.toBe('NaN')
	})

	it.each([
		['', 'Empty password'],
		['123', 'Password too short (less than 6 characters)'],
		[
			'abcdefghijklmnopqrstuvwxyz',
			'Password too long (more than 16 characters)',
		],
	])('Should throw error for invalid password - %s (%s)', (password) => {
		expect(() => Password.create(password)).toThrow('Invalid password')
	})

	describe('verify()', () => {
		it('Should return true for a correct password', () => {
			const plain = 'Pa$$w0rd'
			const passwordVo = Password.create(plain)
			expect(passwordVo.verify(plain)).toBe(true)
		})

		it('Should return false for a wrong password', () => {
			const passwordVo = Password.create('Pa$$w0rd')
			expect(passwordVo.verify('wrongpassword')).toBe(false)
		})
	})

	describe('reconstitute()', () => {
		it('Should restore a Password from a stored hash and allow verification', () => {
			const plain = 'Pa$$w0rd'
			const original = Password.create(plain)
			const restored = Password.reconstitute(original.hash)
			expect(restored.verify(plain)).toBe(true)
		})

		it('Should reject wrong password even after reconstitution', () => {
			const original = Password.create('Pa$$w0rd')
			const restored = Password.reconstitute(original.hash)
			expect(restored.verify('notthepassword')).toBe(false)
		})
	})
})
