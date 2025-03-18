import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogHeader,
	DialogDescription,
} from '@/modules/core/ui/dialog.tsx'
import type React from 'react'
import {} from 'react'
import type { DialogNewLinkProps } from '@/types'
import { CreateLinkForm } from './CreateLinkForm.tsx'

interface CreateLinkDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
	dialogTexts: DialogNewLinkProps
}

export const CreateLinkDialog = ({
	open,
	onOpenChange,
	onSubmit,
	dialogTexts,
}: CreateLinkDialogProps) => {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{dialogTexts.title}</DialogTitle>
					<DialogDescription>{dialogTexts.description}</DialogDescription>
				</DialogHeader>
				<CreateLinkForm
					onSubmit={onSubmit}
					dialogTexts={dialogTexts}
					onCancel={() => onOpenChange(false)}
				/>
			</DialogContent>
		</Dialog>
	)
}
