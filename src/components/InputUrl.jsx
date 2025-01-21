import { Input } from "@heroui/react"
import { useUrl } from '../hooks/useUrl'
import './InputUrl.css'

export default function InputUrl() {
	const { url, setUrl, isInvalid } = useUrl()
	return (
		<Input
			label="Insert your long URL here"
			labelPlacement="outside"
			variant="faded"
			name="url"
			placeholder="https://example.com/my-long-url"
			color={isInvalid ? 'danger' : 'default'}
			className="w-full"
			errorMessage="Please enter a valid URL"
			isInvalid={isInvalid}
			value={url}
			onValueChange={setUrl}
		/>
	)
}
