import { validateUrl } from '@/lib/utils'
import debounce from 'just-debounce-it'
import { useCallback, useEffect, useState } from 'react'

interface UseDebounceValidationProps {
	errorUrlInvalidText: string
}

interface UseDebounceValidationReturn {
	debounceError: string
	debounceValidate: (url: string) => void
}

export const useDebounceValidation = ({
	errorUrlInvalidText,
}: UseDebounceValidationProps): UseDebounceValidationReturn => {
	const [debounceError, setDebounceError] = useState('')

	const debounceValidate = useCallback(
		debounce((url: string) => {
			if (validateUrl(url)) {
				setDebounceError('')
			} else {
				setDebounceError(errorUrlInvalidText)
			}
		}, 500),
		[],
	)
	useEffect(() => {
		return () => {
			debounceValidate.cancel()
		}
	}, [debounceValidate])

	return { debounceError, debounceValidate }
}
