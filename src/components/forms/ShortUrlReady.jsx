import React, { useRef } from 'react'
import { Card, CardBody } from "@heroui/react"
import DownloadQRCodeButton from '@components/DownloadQRCodeButton'
import CreateNewShortUrlButton from '@components/CreateNewShortUrlButton'
import { QRCodeDisplay } from '@components/QRCodeDisplay'
import UrlSnippets from '@components/UrlSnippets'

export default function ShortUrlReady() {
	const qrCodeRef = useRef(null)

	return (
		<>
			<p className="mt-4 text-left">
				Your short URL and QR Code is ready! Share it with everyone!
			</p>
			<Card
				className="border-none bg-[#f7f4e1] w-full mt-10"
				shadow="md"
				fullWidth
			>
				<CardBody>
					<div className="grid grid-cols-8 sm:grid-cols-12 sm:gap-2">
						<div className="mb-5 ml-5 mt-5 col-span-3 sm:col-span-4">
							<p className="text-black text-lg">
								<strong>QR CODE</strong>
							</p>
						</div>
						<div className="mt-5 text-right col-span-9 sm:col-span-8 mr-2">
							<DownloadQRCodeButton qrCodeRef={qrCodeRef} />
						</div>
						<QRCodeDisplay qrCodeRef={qrCodeRef} />
						<UrlSnippets />

						<div className="col-span-8 justify-self-center sm:col-span-12 mt-10 sm:mt-1">
							<CreateNewShortUrlButton />
						</div>
					</div>
				</CardBody>
			</Card>
		</>
	)
}
