import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTurnstile } from '@/hooks/useTurnstile'

describe('hook: useTurnstile', () => {
	beforeEach(() => {
		// Mock global turnstile
		;(window as any).turnstile = {
			render: vi.fn((_container: string | HTMLElement, options: any) => {
				// We store options on the window object to invoke them manually in tests
				;(window as any)._lastTurnstileOptions = options
				return 'mock-widget-id'
			}),
			reset: vi.fn(),
			remove: vi.fn(),
		}
	})

	afterEach(() => {
		delete (window as any).turnstile
		delete (window as any)._lastTurnstileOptions
	})

	it('should initialize with null token', () => {
		const { result } = renderHook(() =>
			useTurnstile({ sitekey: 'some-sitekey' }),
		)

		expect(result.current.turnstileToken).toBeNull()
		expect(window.turnstile?.render).toHaveBeenCalledWith(
			'#turnstile-container',
			expect.any(Object),
		)
	})

	it('should set token when turnstile callback is triggered', () => {
		const { result } = renderHook(() =>
			useTurnstile({ sitekey: 'some-sitekey' }),
		)

		act(() => {
			;(window as any)._lastTurnstileOptions.callback('valid-token')
		})

		expect(result.current.turnstileToken).toBe('valid-token')
	})

	it('should reset token to null on expired-callback', () => {
		const { result } = renderHook(() =>
			useTurnstile({ sitekey: 'some-sitekey' }),
		)

		act(() => {
			;(window as any)._lastTurnstileOptions.callback('valid-token')
		})
		expect(result.current.turnstileToken).toBe('valid-token')

		act(() => {
			;(window as any)._lastTurnstileOptions['expired-callback']()
		})

		expect(result.current.turnstileToken).toBeNull()
	})

	it('should reset token and widget when resetTurnstile is called', () => {
		const { result } = renderHook(() =>
			useTurnstile({ sitekey: 'some-sitekey' }),
		)

		act(() => {
			;(window as any)._lastTurnstileOptions.callback('valid-token')
		})
		expect(result.current.turnstileToken).toBe('valid-token')

		act(() => {
			result.current.resetTurnstile()
		})

		expect(result.current.turnstileToken).toBeNull()
		expect(window.turnstile?.reset).toHaveBeenCalledWith('mock-widget-id')
	})

	it('should cleanup and remove widget on unmount', () => {
		const { unmount } = renderHook(() =>
			useTurnstile({ sitekey: 'some-sitekey' }),
		)

		unmount()

		expect(window.turnstile?.remove).toHaveBeenCalledWith('mock-widget-id')
	})
})
