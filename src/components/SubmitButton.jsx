import { Button } from "@heroui/react"
import { useShortUrl } from '../hooks/useShortUrl'

export default function SubmitButton() {
	const { loading } = useShortUrl()
	return (
		<Button
			type="submit"
			variant="contained"
			className="w-full bg-gradient-to-tr from-blue-500 to-black text-white shadow-lg"
			isDisabled={loading}
		>
			Minify URL
		</Button>
	)
}
