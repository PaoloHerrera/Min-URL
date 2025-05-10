import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogHeader,
	DialogDescription,
} from '@/modules/core/ui/dialog.tsx'
import React from 'react'

interface FormDialogProps {
	isOpen: boolean
	onClose: () => void
	title: string
	description: string
	children: React.ReactElement<{ onClose: () => Promise<void> }>
}

export const FormDialog = ({
	isOpen,
	onClose,
	title,
	description,
	children,
}: FormDialogProps) => {
	// Close Dialog
	const handleClose = (): Promise<void> => {
		return new Promise<void>((resolve) => {
			onClose()
			setTimeout(() => {
				resolve()
			}, 300)
		})
	}

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>
				{React.cloneElement(children, { onClose: handleClose })}
			</DialogContent>
		</Dialog>
	)
}
