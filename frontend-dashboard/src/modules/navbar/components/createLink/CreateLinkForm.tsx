import type { DialogNewLinkProps } from '@/types'
import { CustomSlugInput } from './CustomSlugInput.tsx'
import { Checkbox } from '@/modules/core/ui/checkbox'
import { Input } from '@/modules/core/design-system/Input'
import { useState } from 'react'
import type React from 'react'

interface CreateLinkFormProps {
	dialogTexts: DialogNewLinkProps
	onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
	onCancel: () => void
}

export const CreateLinkForm = ({
	onSubmit,
	onCancel,
	dialogTexts,
}: CreateLinkFormProps) => {
	const [customSlug, setCustomSlug] = useState(false)
	const [slug, setSlug] = useState('')

	return (
		<form onSubmit={onSubmit}>
			<div className="grid gap-10 py-4">
				<div className="grid gap-2">
					<label
						htmlFor="longUrl"
						className="text-mariner-600 font-semibold text-sm"
					>
						{dialogTexts.originalUrl.label}
					</label>
					<Input
						id="longUrl"
						placeholder={dialogTexts.originalUrl.placeholder}
					/>
				</div>

				<div className="grid gap-10 grid-cols-2 w-full items-center">
					<label
						htmlFor="questionSlug"
						className="text-mariner-600 font-semibold text-sm"
					>
						{dialogTexts.questionSlug.label}
					</label>
					<Checkbox
						id="questionSlug"
						onCheckedChange={(checked) => setCustomSlug(checked as boolean)}
					/>
				</div>

				{customSlug && (
					<CustomSlugInput
						slug={slug}
						setSlug={setSlug}
						dialogTexts={dialogTexts}
					/>
				)}
			</div>
			<div className="flex flex-row justify-end gap-5">
				<button
					type="button"
					className="text-mariner-950 bg-transparent rounded-lg flex items-center cursor-pointer hover:bg-mariner-50 text-sm py-2 px-3 border border-mariner-200"
					onClick={onCancel}
				>
					{dialogTexts.cancelText}
				</button>
				<button
					type="submit"
					className="text-white bg-mariner-600 rounded-lg flex items-center cursor-pointer hover:opacity-90 text-sm py-2 px-3"
				>
					{dialogTexts.submitText}
				</button>
			</div>
		</form>
	)
}
