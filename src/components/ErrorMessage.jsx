import { Alert } from "@heroui/react"
import { useShortUrl } from '../hooks/useShortUrl'

export default function ErrorMessage() {
	const { error } = useShortUrl()
	return <>{error && <Alert color="danger" title={error} />}</>
}
