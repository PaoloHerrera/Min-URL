import {
	Card,
	CardHeader,
	CardBody,
	CardFooter,
} from '@/modules/core/design-system/Card.tsx'
import {
	BarChart,
	BarChart2Icon,
	CopyIcon,
	ExternalLinkIcon,
	ClockIcon,
	CheckCheck,
} from 'lucide-react'
import {
	Tooltip,
	TooltipProvider,
	TooltipTrigger,
	TooltipContent,
} from '@/modules/core/ui/tooltip'
import { useTranslations } from '@/modules/core/hooks/useTranslations.ts'
import { useClipboard } from '@/modules/createNew/hooks/useClipboard.ts'

interface LinkCardProps {
	title: string
	clicks: number
	shortUrl: string
	slug: string
	longUrl: string
	createdAt: string
}

export const LinkCard = ({
	title,
	clicks,
	shortUrl,
	slug,
	longUrl,
	createdAt,
}: LinkCardProps) => {
	const { link } = useTranslations()
	const { linkCard } = link
	const { isSuccessCopy, copyToClipboard } = useClipboard()

	const SuccessCopyIcon = ({ isSuccess }: { isSuccess: boolean }) => {
		return isSuccess ? (
			<CheckCheck className="text-success" size={20} />
		) : (
			<CopyIcon className="text-mariner-600" size={20} />
		)
	}

	return (
		<Card>
			<CardHeader>
				<div className="flex flex-row justify-between items-center w-full">
					<span className="font-semibold text-mariner-950 opacity-70 w-full">
						{title}
					</span>
					<div className="font-semibold text-mariner-950 text-sm opacity-70 gap-2 items-center w-full flex justify-end">
						<BarChart className="text-mariner-600" size={20} />
						<span>{clicks} clicks</span>
					</div>
				</div>
			</CardHeader>
			<CardBody>
				<div className="flex flex-col gap-2">
					<span className="text-mariner-600 font-semibold text-sm">
						{shortUrl}
					</span>
					<span className="text-mariner-950 font-semibold text-xs opacity-70 truncate max-w-full">
						{longUrl}
					</span>
				</div>
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
										href={`/links/${slug}`}
										target="_blank"
										rel="noreferrer"
										className="p-1 border-1 border-mariner-500 rounded-md"
									>
										<BarChart2Icon className="text-mariner-600" size={20} />
									</a>
								</TooltipTrigger>
								<TooltipContent>
									<span className="text-mariner-950 font-medium text-sm">
										{linkCard.details}
									</span>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>

						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild={true}>
									<button
										onClick={() => copyToClipboard(shortUrl)}
										type="button"
										className="p-1 border-1 border-mariner-500 rounded-md cursor-pointer"
									>
										<SuccessCopyIcon isSuccess={isSuccessCopy} />
									</button>
								</TooltipTrigger>
								<TooltipContent>
									<span className="text-mariner-950 font-medium text-sm">
										{linkCard.copy}
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
										{linkCard.externalLink}
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
