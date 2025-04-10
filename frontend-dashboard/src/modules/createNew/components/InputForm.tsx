import { Input } from '@/modules/core/design-system/Input'
import type React from 'react'

interface InputFormProps {
	inputText: {
		label: string
		placeholder: string
		error: {
			minLength: string
			maxLength?: string
			generic: string
		}
	}
	error?: string
	disabled?: boolean
	name: string
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	onBlur: (e: React.FocusEvent<HTMLInputElement>) => void
	ref: React.Ref<HTMLInputElement>
}

export const InputForm = ({
	inputText,
	error,
	disabled,
	...registerProps
}: InputFormProps) => {
	return (
		<div className="grid gap-2">
			<label
				htmlFor={inputText.label}
				className="text-mariner-600 font-semibold text-sm"
			>
				{inputText.label}
			</label>
			<div className="flex items-center gap-2">
				<div className="flex items-center gap-2 w-full">
					<Input
						id={inputText.label}
						type="text"
						placeholder={inputText.placeholder}
						error={!!error}
						disabled={disabled}
						{...registerProps}
					/>
				</div>
			</div>
			<span className="text-xs text-error font-semibold text-center">
				{error}
			</span>
		</div>
	)
}
