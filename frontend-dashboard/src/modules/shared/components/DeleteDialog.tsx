import {
	AlertDialog,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogCancel,
	AlertDialogAction,
} from '@/modules/core/ui/alert-dialog'
import { Spinner } from '@/modules/core/design-system/Spinner'
import { useTranslations } from '@/modules/core/hooks/useTranslations'

type EntityType = 'link' | 'qrcode'

interface DeleteDialogProps {
	entity: EntityType
	entityId: string
	isOpen: boolean
	isLoading: boolean
	deleteError: string | null
	onConfirm: (id: string) => void
	onCancel: () => void
}

export const DeleteDialog = ({
	entity,
	entityId,
	isOpen,
	isLoading,
	deleteError,
	onConfirm,
	onCancel,
}: DeleteDialogProps) => {
	const { link, qrcode } = useTranslations()
	const translation =
		entity === 'link'
			? link.linkCard.deleteDialog
			: qrcode.qrcodeCard.deleteDialog

	return (
		<AlertDialog open={isOpen}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{translation.title}</AlertDialogTitle>
				</AlertDialogHeader>
				<AlertDialogDescription className="text-mariner-950 opacity-70">
					{translation.description}
				</AlertDialogDescription>

				{deleteError && (
					<AlertDialogDescription className="text-error text-sm font-semibold">
						{translation.errorLabel}
					</AlertDialogDescription>
				)}
				<AlertDialogFooter>
					<AlertDialogCancel
						onClick={() => onCancel()}
						className="cursor-pointer"
						disabled={isLoading}
					>
						{translation.cancelLabel}
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={() => onConfirm(entityId)}
						className="cursor-pointer bg-error text-white hover:bg-[#c70c07]"
						disabled={isLoading}
					>
						{isLoading ? (
							<div className="flex items-center gap-2">
								<Spinner className="text-mariner-100 text-sm" />
								<span>{translation.loadingDelete}</span>
							</div>
						) : (
							<span>{translation.deleteLabel}</span>
						)}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
