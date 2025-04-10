import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogHeader,
	DialogDescription,
} from '@/modules/core/ui/dialog.tsx'
import React from 'react'

interface CreateNewProps {
	open: boolean
	setOpen: (open: boolean) => void
	title: string
	description: string
	children: React.ReactElement<{ onClose: () => Promise<void> }>
}

export const CreateNew = ({
	open,
	setOpen,
	title,
	description,
	children,
}: CreateNewProps) => {
	// Close Dialog
	const handleClose = (): Promise<void> => {
		return new Promise<void>((resolve) => {
			setOpen(false)
			setTimeout(() => {
				resolve()
			}, 300)
		})
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
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
