import { describe, it, expect } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useDebounceValidation } from '@/hooks/useDebounceValidation'

const EN_TEXTS = {
	errorUrlInvalidText: 'Please enter a valid URL',
}

describe('hook useDebounceValidation', () => {
	it('should debounceError empty when is starting', () => {
		const { result } = renderHook(() => useDebounceValidation(EN_TEXTS))
		expect(result.current.debounceError).toBe('')
	})

	it('should debounceError with error', async () => {
		const { result } = renderHook(() => useDebounceValidation(EN_TEXTS))

		act(() => {
			result.current.debounceValidate('invalid url')
		})

		await waitFor(() => {
			expect(result.current.debounceError).toBe(EN_TEXTS.errorUrlInvalidText)
		})
	})

	it('should debounceError empty when url is valid', async () => {
		const { result } = renderHook(() => useDebounceValidation(EN_TEXTS))

		act(() => {
			result.current.debounceValidate('invalid url')
		})

		await waitFor(() => {
			expect(result.current.debounceError).toBe(EN_TEXTS.errorUrlInvalidText)
		})

		act(() => {
			result.current.debounceValidate('https://www.google.com')
		})

		await waitFor(() => {
			expect(result.current.debounceError).toBe('')
		})
	})
})
