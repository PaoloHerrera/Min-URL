import { downloadQrCode } from '@/lib/downloadQrCode'
import {
	Card,
	CardHeader,
	CardBody,
	CardFooter,
} from '@/modules/core/design-system/Card.tsx'
import { QrPreview } from '@/modules/createNew/components/QrPreview'
import {
	QrCodeIcon,
	BarChart2Icon,
	ExternalLinkIcon,
	ClockIcon,
	DownloadIcon,
} from 'lucide-react'
import {
	Tooltip,
	TooltipProvider,
	TooltipTrigger,
	TooltipContent,
} from '@/modules/core/ui/tooltip.tsx'
import { useTranslations } from '@/modules/core/hooks/useTranslations.ts'

interface QrCardProps {
	title: string
	scans: number
	shortUrl: string
	slug: string
	longUrl: string
	foregroundColor: string
	backgroundColor: string
	createdAt: string
}

export const QrCodeCard = ({
	title,
	scans,
	shortUrl,
	slug,
	longUrl,
	foregroundColor,
	backgroundColor,
	createdAt,
}: QrCardProps) => {
	const { qrcode } = useTranslations()
	const { qrcodeCard } = qrcode

	return (
		<Card>
			<CardHeader>
				<div className="flex flex-row justify-between items-center w-full">
					<span className="font-semibold text-mariner-950 opacity-70 w-full">
						{title}
					</span>
					<div className="font-semibold text-mariner-950 text-sm opacity-70 gap-2 items-center w-full flex justify-end">
						<QrCodeIcon className="text-mariner-600" size={20} />
						<span>{scans} scans</span>
					</div>
				</div>
			</CardHeader>
			<CardBody>
				<div className="flex flex-col items-center">
					<QrPreview
						id={slug}
						value={shortUrl}
						foregroundColor={foregroundColor}
						backgroundColor={backgroundColor}
						size={100}
					/>
				</div>
				<span className="text-mariner-950 font-semibold text-xs opacity-70 truncate max-w-full text-center">
					{longUrl}
				</span>
			</CardBody>
			<CardFooter>
				<div className="flex flex-row justify-between items-center">
					<span className="text-xs text-mariner-950 opacity-70 flex flex-row gap-1 items-center">
						<ClockIcon size={12} /> {createdAt}
					</span>
					<div className="flex flex-row gap-2">
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild={true}>
									<a
										href={`/qrcodes/${slug}`}
										target="_blank"
										rel="noreferrer"
										className="p-1 border-1 border-mariner-500 rounded-md"
									>
										<BarChart2Icon className="text-mariner-600" size={20} />
									</a>
								</TooltipTrigger>
								<TooltipContent>
									<span className="text-mariner-950 font-medium text-sm">
										{qrcodeCard.details}
									</span>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild={true}>
									<button
										onClick={() => downloadQrCode(title, slug)}
										type="button"
										className="p-1 border-1 border-mariner-500 rounded-md cursor-pointer"
									>
										<DownloadIcon className="text-mariner-600" size={20} />
									</button>
								</TooltipTrigger>
								<TooltipContent>
									<span className="text-mariner-950 font-medium text-sm">
										{qrcodeCard.download}
									</span>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild={true}>
									<a
										href={longUrl}
										target="_blank"
										rel="noreferrer"
										className="p-1 border-1 border-mariner-500 rounded-md"
									>
										<ExternalLinkIcon className="text-mariner-600" size={20} />
									</a>
								</TooltipTrigger>
								<TooltipContent>
									<span className="text-mariner-950 font-medium text-sm">
										{qrcodeCard.externalLink}
									</span>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
				</div>
			</CardFooter>
		</Card>
	)
}
