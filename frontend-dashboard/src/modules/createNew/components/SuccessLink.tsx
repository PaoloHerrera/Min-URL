import { Input } from '@/modules/core/design-system/Input.tsx'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/modules/core/ui/alert-dialog.tsx'
import { LinkIcon } from 'lucide-react'
import { useNewShortUrlStore } from '@/stores/newShortUrlStore.ts'
import { useTranslations } from '@/modules/core/hooks/useTranslations.ts'
import { useClipboard } from '@/modules/core/hooks/useClipboard'
import { useFormattedDate } from '@/modules/createNew/hooks/useFormattedDate'
import { SuccessCopyIcon } from '@/modules/shared/components/SuccessCopyIcon'

export const SuccessLink = () => {
	const { newShortUrl, setNewShortUrl } = useNewShortUrlStore()
	const { dashboard } = useTranslations()
	const { successLink } = dashboard.navbar
	const { isSuccessCopy, copyToClipboard } = useClipboard()
	const formattedDate = useFormattedDate(newShortUrl?.createdAt)

	return (
		<AlertDialog open={!!newShortUrl} onOpenChange={() => setNewShortUrl(null)}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{successLink.title}</AlertDialogTitle>
					<AlertDialogDescription>
						{successLink.description}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<div className="flex flex-col items-center">
					<div className="flex flex-row items-center gap-5 w-full relative">
						<LinkIcon
							className="absolute top-auto left-2 text-mariner-600"
							size={18}
						/>
						<Input
							type="text"
							disabled={true}
							className="pl-10 font-semibold"
							value={newShortUrl?.shortUrl ?? ''}
						/>
						<button
							type="button"
							className="cursor-pointer absolute top-auto right-4 "
							onClick={() => copyToClipboard(newShortUrl?.shortUrl as string)}
							disabled={isSuccessCopy}
						>
							<SuccessCopyIcon isSuccess={isSuccessCopy} />
						</button>
					</div>

					<div className="w-full bg-mariner-50 border-mariner-200 rounded-md mt-5 p-4 shadow-sm flex flex-col gap-2">
						<h3 className="text-mariner-950 opacity-50 text-sm font-semibold">
							{successLink.linkStatistics.title}
						</h3>
						<div className="flex flex-row items-center gap-2">
							<div className="flex-1">
								<span className="text-mariner-950 text-sm font-semibold">
									{successLink.linkStatistics.status}{' '}
								</span>
								<span className="text-success text-sm font-semibold">
									{successLink.linkStatistics.active}
								</span>
							</div>
							<div className="flex-1">
								<span className="text-mariner-950 text-sm font-semibold">
									{successLink.linkStatistics.clicks}{' '}
								</span>
								<span className="text-mariner-950 text-sm font-semibold">
									0
								</span>
							</div>
						</div>
						<div className="flex flex-row items-center gap-2">
							<div className="flex-1">
								<span className="text-mariner-950 text-sm font-semibold">
									{successLink.linkStatistics.created}{' '}
								</span>
								<span className="text-mariner-950 text-sm font-semibold">
									{formattedDate}
								</span>
							</div>
							<div className="flex-1">
								<span className="text-mariner-950 text-sm font-semibold">
									{successLink.linkStatistics.expires}{' '}
								</span>
								<span className="text-mariner-950 text-sm font-semibold">
									{successLink.linkStatistics.never}
								</span>
							</div>
						</div>
					</div>
				</div>
				<AlertDialogFooter>
					<AlertDialogAction className="w-fit rounded-md bg-mariner-600 px-4 py-2 text-white hover:bg-mariner-700 cursor-pointer">
						{successLink.done}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
