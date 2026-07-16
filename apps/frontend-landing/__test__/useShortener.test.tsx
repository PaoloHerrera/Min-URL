import { describe, it, expect, vi, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useShortener } from '@/hooks/useShortener'
import { shortenAnonService } from '@/services/shortenAnonService'

const EN_TEXTS = {
	errorShortenFailedText: 'Something went wrong. Please try again later.',
}

vi.mock('@/services/shortenAnonService', () => ({
	shortenAnonService: vi.fn(),
}))

afterEach(() => {
	vi.clearAllMocks()
})

describe('hook: useShortener', () => {
	it('should be empty when is starting', () => {
		const { result } = renderHook(() => useShortener(EN_TEXTS))
		expect(result.current.shortUrl).toBe('')
		expect(result.current.isLoading).toBe(false)
		expect(result.current.apiError).toBe('')
	})

	it('should be loading when is shorting', async () => {
		const { result } = renderHook(() => useShortener(EN_TEXTS))

		vi.mocked(shortenAnonService).mockReturnValue(new Promise<string>(() => {}))
		act(() => {
			result.current.shorten('https://google.com', 'mock-turnstile-token')
		})
		await waitFor(() => {
			expect(result.current.isLoading).toBe(true)
		})
	})

	it('should have url after shorting', async () => {
		const { result } = renderHook(() => useShortener(EN_TEXTS))

		vi.mocked(shortenAnonService).mockResolvedValue('https://murl.cl/abc123')
		act(() => {
			result.current.shorten('https://google.com', 'mock-turnstile-token')
		})

		await waitFor(() => {
			expect(result.current.shortUrl).toBe('https://murl.cl/abc123')
		})
	})

	it('should have error if api returns error', async () => {
		const { result } = renderHook(() => useShortener(EN_TEXTS))

		vi.mocked(shortenAnonService).mockRejectedValue(new Error('API Error'))
		act(() => {
			result.current.shorten('https://google.com', 'mock-turnstile-token')
		})

		await waitFor(() => {
			expect(result.current.apiError).toBe(
				'Something went wrong. Please try again later.',
			)
		})
	})

	it('should set api error to empty when resetting state', async () => {
		const { result } = renderHook(() => useShortener(EN_TEXTS))

		vi.mocked(shortenAnonService).mockRejectedValue(new Error('API Error'))
		act(() => {
			result.current.shorten('https://google.com', 'mock-turnstile-token')
		})

		await waitFor(() => {
			expect(result.current.apiError).toBe(
				'Something went wrong. Please try again later.',
			)
		})

		act(() => {
			result.current.reset()
		})

		expect(result.current.apiError).toBe('')
	})

	it('should set short url to empty when resetting state', async () => {
		const { result } = renderHook(() => useShortener(EN_TEXTS))

		vi.mocked(shortenAnonService).mockResolvedValue('https://murl.cl/abc123')
		act(() => {
			result.current.shorten('https://google.com', 'mock-turnstile-token')
		})

		await waitFor(() => {
			expect(result.current.shortUrl).toBe('https://murl.cl/abc123')
		})

		act(() => {
			result.current.reset()
		})

		expect(result.current.shortUrl).toBe('')
	})

	it('should stop loading when resetting state', async () => {
		const { result } = renderHook(() => useShortener(EN_TEXTS))

		vi.mocked(shortenAnonService).mockReturnValue(new Promise<string>(() => {}))
		act(() => {
			result.current.shorten('https://google.com', 'mock-turnstile-token')
		})

		await waitFor(() => {
			expect(result.current.isLoading).toBe(true)
		})

		act(() => {
			result.current.reset()
		})

		expect(result.current.isLoading).toBe(false)
	})

	it('should ignore new calls when is loading', async () => {
		const { result } = renderHook(() => useShortener(EN_TEXTS))

		vi.mocked(shortenAnonService).mockReturnValue(new Promise<string>(() => {}))
		act(() => {
			result.current.shorten('https://google.com', 'mock-turnstile-token')
		})
		await waitFor(() => {
			expect(result.current.isLoading).toBe(true)
		})

		act(() => {
			result.current.shorten('https://google.com', 'mock-turnstile-token')
		})

		expect(vi.mocked(shortenAnonService)).toHaveBeenCalledTimes(1)
	})
})
