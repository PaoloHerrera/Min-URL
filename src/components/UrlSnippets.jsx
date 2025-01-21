import { Snippet } from "@heroui/react"
import { useUrl } from '@hooks/useUrl'
import { useShortUrl } from '@hooks/useShortUrl'

export default function UrlSnippets() {
	const { url } = useUrl()
	const { shortUrl } = useShortUrl()
	return (
		<>
			<div className="col-span-12 items-center sm:col-span-8 mt-5">
				<div className="grid grid-cols-12 items-center col-span-12 sm:col-span-8 mr-2 sm:gap-2 h-10">
					<div className="col-span-12 sm:col-span-12">
						<Snippet
							symbol="♾️"
							variant="bordered"
							className="truncate-url w-full text-black h-10"
							hideCopyButton
							style={{
								borderColor: '#1d4980',
							}}
						>
							{url}
						</Snippet>
					</div>
				</div>
				<div className="grid grid-cols-12 items-center col-span-12 sm:col-span-8 mr-2 sm:gap-2 mt-3">
					<div className="col-span-12 sm:col-span-12">
						<Snippet
							symbol="🔗"
							variant="bordered"
							className="w-full text-black h-10"
							tooltipProps={{
								placement: 'bottom',
								content: 'Copy Short URL',
								className: 'text-white bg-[#149c6e]',
							}}
							style={{ borderColor: '#149c6e' }}
						>
							{shortUrl}
						</Snippet>
					</div>
				</div>
			</div>
		</>
	)
}
