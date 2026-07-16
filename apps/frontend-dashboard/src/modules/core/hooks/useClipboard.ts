import { useState } from 'react'

export const useClipboard = () => {
	const [isSuccessCopy, setIsSuccessCopy] = useState(false)

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text)
		setIsSuccessCopy(true)
		setTimeout(() => {
			setIsSuccessCopy(false)
		}, 2000)
	}

	return { isSuccessCopy, copyToClipboard }
}
