import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogHeader,
	DialogDescription,
} from '@/modules/core/ui/dialog.tsx'
import { CreateLinkForm } from './components/CreateLinkForm.tsx'
import { useDialogStore } from '@/stores/dialogStore.ts'
import { useTranslations } from '@/modules/core/hooks/useTranslations.ts'

export const CreateLinkDialog = () => {
	const { openDialogLink, setOpenDialogLink } = useDialogStore()
	const { dashboard } = useTranslations()
	const { dialogNewLink } = dashboard.navbar

	const handleClose = (): Promise<void> => {
		return new Promise<void>((resolve) => {
			setOpenDialogLink(false)
			setTimeout(() => {
				resolve()
			}, 300)
		})
	}

	return (
		<Dialog open={openDialogLink} onOpenChange={setOpenDialogLink}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{dialogNewLink.title}</DialogTitle>
					<DialogDescription>{dialogNewLink.description}</DialogDescription>
				</DialogHeader>
				<CreateLinkForm onCancel={handleClose} />
			</DialogContent>
		</Dialog>
	)
}
