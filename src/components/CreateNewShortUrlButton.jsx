import { Button } from '@nextui-org/react'
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
			className="bg-gradient-to-tr from-green-500 to-black text-white"
			variant="solid"
			onPress={() => handleCreateNewShortUrl()}
		>
			Create a New Short URL
		</Button>
	)
}
