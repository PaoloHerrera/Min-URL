import { Button } from "@heroui/react"
import { useUrl } from '@hooks/useUrl'
import { useShortUrl } from '@hooks/useShortUrl'

export default function CreateNewShortUrlButton() {
	const { setUrl } = useUrl()
	const { setShortUrl } = useShortUrl()

	const handleCreateNewShortUrl = () => {
		setUrl('')
		setShortUrl('')
	}

	return (
		<Button
			className="text-white bg-[#149c6e] w-full mt-4"
			variant="solid"
			onPress={() => handleCreateNewShortUrl()}
		>
			Create a New Short URL
		</Button>
	)
}
