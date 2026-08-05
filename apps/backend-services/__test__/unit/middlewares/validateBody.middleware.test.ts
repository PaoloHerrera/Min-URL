import { InvalidPayloadError } from '@/adapters/errors/infra.errors.ts'
import { validateBody } from '@/adapters/primary/http/middlewares/validateBody.middleware.ts'
import type { Request, Response } from 'express'
import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'

describe('validateBody Middleware (Unit Test)', () => {
	const sampleSchema = z.object({
		url: z.url('Invalid URL format'),
		title: z.string().min(1, 'Title is required'),
	})

	it('Should call next() and keep parsed valid data in req.body when payload is valid', () => {
		const req = {
			body: {
				url: 'https://example.com',
				title: 'Example',
			},
		} as Request
		const res = {} as Response
		const next = vi.fn()

		validateBody(sampleSchema)(req, res, next)

		expect(next).toHaveBeenCalledTimes(1)
		expect(next).toHaveBeenCalledWith()
		expect(req.body).toEqual({
			url: 'https://example.com',
			title: 'Example',
		})
	})

	it('Should strip unknown extra fields from req.body when validating', () => {
		const req = {
			body: {
				url: 'https://example.com',
				title: 'Example',
				extraField: 'should_be_removed',
				maliciousCode: '<script></script>',
			},
		} as Request
		const res = {} as Response
		const next = vi.fn()

		validateBody(sampleSchema)(req, res, next)

		expect(next).toHaveBeenCalledTimes(1)
		expect(next).toHaveBeenCalledWith()
		expect(req.body).toEqual({
			url: 'https://example.com',
			title: 'Example',
		})
		expect(req.body).not.toHaveProperty('extraField')
		expect(req.body).not.toHaveProperty('maliciousCode')
	})

	it('Should call next with InvalidPayloadError containing Zod error message when payload is invalid', () => {
		const req = {
			body: {
				url: 'not-a-valid-url',
				title: 'Example',
			},
		} as Request
		const res = {} as Response
		const next = vi.fn()

		validateBody(sampleSchema)(req, res, next)

		expect(next).toHaveBeenCalledTimes(1)
		const errorArg = next.mock.calls[0][0]
		expect(errorArg).toBeInstanceOf(InvalidPayloadError)
		expect(errorArg.message).toBe('Invalid URL format')
	})

	it('Should fallback to default error message if Zod issue message is empty', () => {
		const emptyMessageSchema = {
			safeParse: () => ({
				success: false,
				error: {
					issues: [{}],
				},
			}),
		} as unknown as z.ZodTypeAny

		const req = { body: {} } as Request
		const res = {} as Response
		const next = vi.fn()

		validateBody(emptyMessageSchema)(req, res, next)

		expect(next).toHaveBeenCalledTimes(1)
		const errorArg = next.mock.calls[0][0]
		expect(errorArg).toBeInstanceOf(InvalidPayloadError)
		expect(errorArg.message).toBe('Invalid request body')
	})

	it('Should handle undefined or null req.body gracefully by passing InvalidPayloadError to next', () => {
		const req = { body: undefined } as unknown as Request
		const res = {} as Response
		const next = vi.fn()

		validateBody(sampleSchema)(req, res, next)

		expect(next).toHaveBeenCalledTimes(1)
		const errorArg = next.mock.calls[0][0]
		expect(errorArg).toBeInstanceOf(InvalidPayloadError)
	})
})
