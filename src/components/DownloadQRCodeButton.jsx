import { Button } from "@heroui/react"
import * as htmlToImage from 'html-to-image'
import { useUrl } from '@hooks/useUrl'

export default function DownloadQRCodeButton({ qrCodeRef }) {
	const { url } = useUrl()

	const downloadQRCode = () => {
		const domain = new URL(url).hostname.replace('www.', '')
		const fileName = domain ? `qr-code-${domain}.png` : 'qr-code.png'

		htmlToImage
			.toPng(qrCodeRef.current)
			.then((dataUrl) => {
				const link = document.createElement('a')
				link.href = dataUrl
				link.download = fileName
				link.click()
			})
			.catch((error) => {
				console.error('Error to donwloading QR code:', error)
			})
	}

	return (
		<Button
			className="text-white bg-[#1d4980]"
			variant="solid"
			onPress={downloadQRCode}
		>
			Download PNG
		</Button>
	)
}
