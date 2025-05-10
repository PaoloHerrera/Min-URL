import {
	Card,
	CardHeader,
	CardBody,
	CardFooter,
} from '@/modules/core/design-system/Card.tsx'
import {
	BarChart,
	BarChart2Icon,
	ExternalLinkIcon,
	ClockIcon,
	EllipsisVerticalIcon,
	PencilIcon,
	Trash2Icon,
} from 'lucide-react'
import {
	Tooltip,
	TooltipProvider,
	TooltipTrigger,
	TooltipContent,
} from '@/modules/core/ui/tooltip'
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from '@/modules/core/ui/dropdown-menu'

import { useTranslations } from '@/modules/core/hooks/useTranslations.ts'
import { useClipboard } from '@/modules/core/hooks/useClipboard.ts'
import { DeleteDialog } from '@/modules/shared/components/DeleteDialog'
import { SuccessCopyIcon } from '@/modules/shared/components/SuccessCopyIcon'

import { useEntityDeletion } from '@/modules/core/hooks/useEntityDeletion'
import { useEditLink } from '@/modules/core/hooks/useEditLink'

import { FormDialog } from '@/modules/shared/components/FormDialog'
import { EditLinkForm } from '@/modules/link/components/EditLinkForm'

interface LinkCardProps {
	id: string
	title: string
	clicks: number
	shortUrl: string
	slug: string
	longUrl: string
	createdAt: string
}

export const LinkCard = ({
	id,
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
	const { deleteState, openDialog, closeDialog, deleteEntity } =
		useEntityDeletion('link')

	const { editState, openEditDialog, closeEditDialog } = useEditLink()

	return (
		<>
			<Card>
				<CardHeader>
					<div className="flex flex-row justify-between items-center w-full gap-2">
						<span className="font-semibold text-mariner-950 opacity-70 w-full">
							{title}
						</span>
						<div className="font-semibold text-mariner-950 text-sm opacity-70 gap-2 items-center w-full flex justify-end">
							<BarChart className="text-mariner-600" size={20} />
							<span>{clicks} clicks</span>
						</div>
						<div className="flex flex-row gap-2">
							<DropdownMenu>
								<DropdownMenuTrigger asChild={true}>
									<button
										className="p-2 cursor-pointer hover:bg-mariner-50 hover:rounded-md"
										type="button"
									>
										<EllipsisVerticalIcon
											className="text-mariner-600"
											size={18}
										/>
									</button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuItem asChild={true}>
										<a href={`/links/${slug}`} className="cursor-pointer">
											<BarChart2Icon size={16} className="text-mariner-950" />
											{linkCard.statistics}
										</a>
									</DropdownMenuItem>
									<DropdownMenuItem asChild={true}>
										<button
											className="cursor-pointer w-full"
											type="button"
											onClick={() => openEditDialog()}
										>
											<PencilIcon size={20} className="text-mariner-950" />{' '}
											{linkCard.edit}
										</button>
									</DropdownMenuItem>
									<DropdownMenuItem asChild={true}>
										<button
											className="cursor-pointer w-full text-error"
											type="button"
											onClick={() => openDialog()}
										>
											<Trash2Icon size={20} className="text-error" />
											{linkCard.delete}
										</button>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
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
											<ExternalLinkIcon
												className="text-mariner-600"
												size={20}
											/>
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

			<DeleteDialog
				entity="link"
				entityId={id}
				onConfirm={deleteEntity}
				onCancel={closeDialog}
				isOpen={deleteState.isOpen}
				isLoading={deleteState.isLoading}
				deleteError={deleteState.error}
			/>

			<FormDialog
				isOpen={editState.isOpen}
				onClose={closeEditDialog}
				title={link.editDialog.title}
				description={link.editDialog.description}
			>
				<EditLinkForm
					id={id}
					title={title}
					url={longUrl}
					clicks={clicks}
					onClose={closeEditDialog}
				/>
			</FormDialog>
		</>
	)
}
