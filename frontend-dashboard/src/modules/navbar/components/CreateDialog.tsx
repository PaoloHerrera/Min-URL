import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogHeader,
	DialogDescription,
	DialogFooter,
} from '@/modules/core/ui/dialog.tsx'

import { Input } from '@/modules/core/design-system/Input'
import type React from 'react'

type AdditionalFieldsProps = {
	id: string
	label: string
	placeholder: string
	prefix?: string
}

interface CreateDialogBasicProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

interface CreateDialogProps extends CreateDialogBasicProps {
	title: string
	description: string
	additionalFields?: AdditionalFieldsProps[]
	actionText: string
}

const CreateDialog = ({
	open,
	onOpenChange,
	title,
	description,
	additionalFields = [],
	actionText,
	onSubmit,
}: CreateDialogProps) => {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>
				<form onSubmit={onSubmit}>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<label
								htmlFor="longUrl"
								className="text-mariner-950 font-semibold text-sm"
							>
								Original URL
							</label>
							<Input
								id="longUrl"
								placeholder="https://example.com/very/long/url/that/needs/shortening"
							/>
						</div>
						{additionalFields.map((field) => (
							<div key={field.id} className="grid gap-2">
								<label
									htmlFor={field.id}
									className="text-mariner-950 font-semibold text-sm"
								>
									{field.label}
								</label>
								<div className="flex items-center gap-2">
									{field.prefix && (
										<div className="flex-shrink-0 text-mariner-950">
											{field.prefix}
										</div>
									)}
									<Input id={field.id} placeholder={field.placeholder} />
								</div>
							</div>
						))}
					</div>
					<DialogFooter className="flex flex-row justify-end gap-5">
						<button
							type="button"
							className="text-mariner-950 bg-transparent rounded-lg flex items-center cursor-pointer hover:bg-mariner-50 text-sm py-2 px-3 border border-mariner-200"
							onClick={() => onOpenChange(false)}
						>
							Cancel
						</button>
						<button
							type="submit"
							className="text-white bg-mariner-600 rounded-lg flex items-center cursor-pointer hover:opacity-90 text-sm py-2 px-3"
						>
							{actionText}
						</button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}

export const CreateLinkDialog = ({
	open,
	onOpenChange,
	onSubmit,
}: CreateDialogBasicProps) => {
	const additionalFields = [
		{
			id: 'customAlias',
			label: 'Custom Slug (optional)',
			placeholder: 'my-custom-link',
			prefix: 'go.min-url.com/',
		},
	]
	return (
		<CreateDialog
			open={open}
			onOpenChange={onOpenChange}
			title="Create New Link"
			description="Shorten a long URL and customize your link."
			additionalFields={additionalFields}
			actionText="Create Link"
			onSubmit={onSubmit}
		/>
	)
}

export const CreateQrCodeDialog = ({
	open,
	onOpenChange,
	onSubmit,
}: CreateDialogBasicProps) => {
	return (
		<CreateDialog
			open={open}
			onOpenChange={onOpenChange}
			title="Create New QR Code"
			description="Generate a QR code for a long URL."
			additionalFields={[]}
			actionText="Create QR Code"
			onSubmit={onSubmit}
		/>
	)
}
