import { Snippet } from '@nextui-org/react'
import { useUrl } from '@hooks/useUrl'
import { useShortUrl } from '@hooks/useShortUrl'

export default function UrlSnippets() {
	const { url } = useUrl()
	const { shortUrl } = useShortUrl()
	return (
		<>
			<div className="col-span-12 items-center sm:col-span-8 mt-5">
				<div className="grid grid-cols-12 items-center col-span-12 sm:col-span-8 mr-2 sm:gap-2">
					<div className="col-span-12 sm:col-span-12">
						<Snippet
							symbol="♾️"
							variant="bordered"
							color="primary"
							className="truncate-url w-full text-white"
							hideCopyButton
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
							color="success"
							className="w-full text-white"
						>
							{shortUrl}
						</Snippet>
					</div>
				</div>
			</div>
		</>
	)
}
