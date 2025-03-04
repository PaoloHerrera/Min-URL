import { useState } from 'react'
import { Copy, ExternalLink, CheckCheck } from 'lucide-react'
import {
	Card,
	CardHeader,
	CardFooter,
} from '@/modules/core/design-system/Card.tsx'
import { useTranslation } from '@/modules/core/hooks/useTranslation'
import { ActionTooltip } from '@/modules/core/design-system/ActionTooltip.tsx'

const SuccessCopyIcon = ({ isSuccess }: { isSuccess: boolean }) => {
	return isSuccess ? (
		<CheckCheck className="text-success" />
	) : (
		<Copy className="text-mariner-700" />
	)
}

export const ShortUrlCard = ({
	shortUrl,
	createdAt,
}: { shortUrl: string; createdAt: string }) => {
	const { t } = useTranslation()
	const { common } = t('hero')
	const [isSuccessCopy, setIsSuccessCopy] = useState(false)

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text)
		setIsSuccessCopy(true)
		setTimeout(() => {
			setIsSuccessCopy(false)
		}, 2000)
	}

	const secondsAgo = (
		(Date.now() - new Date(createdAt).getTime()) /
		1000
	).toFixed(0)

	return (
		<Card>
			<CardHeader>
				<span className="text-mariner-700 opacity-90 text-sm font-medium">
					{common.yourShortUrl}:
				</span>
				<div className="flex justify-between">
					<span className="font-extrabold text-mariner-700 text-lg">
						{shortUrl}
					</span>
					<div className="flex gap-5 items-center">
						<ActionTooltip
							tooltipText={isSuccessCopy ? common.copied : common.copy}
						>
							<button type="button" onClick={() => copyToClipboard(shortUrl)}>
								<SuccessCopyIcon isSuccess={isSuccessCopy} />
							</button>
						</ActionTooltip>
						<ActionTooltip tooltipText={common.open}>
							<a href={shortUrl} target="_blank" rel="noreferrer">
								<ExternalLink className="text-mariner-700" />
							</a>
						</ActionTooltip>
					</div>
				</div>
			</CardHeader>
			<div className="border-b border-mariner-700/70 w-full" />
			<CardFooter>
				<div className="flex justify-between">
					<span className="text-mariner-700 opacity-90 text-sm font-medium">
						{common.createdAt} {secondsAgo} {common.secondsAgo}
					</span>
					<span className="text-mariner-700 opacity-90 text-sm font-medium">
						0 clicks
					</span>
				</div>
			</CardFooter>
		</Card>
	)
}
