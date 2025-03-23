import { Input } from '@/modules/core/design-system/Input'
import type React from 'react'

interface LongUrlProps {
	textUrl: {
		label: string
		placeholder: string
		errorMessage: string
	}
	error?: string
	disabled?: boolean
	name: string
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	onBlur: (e: React.FocusEvent<HTMLInputElement>) => void
	ref: React.Ref<HTMLInputElement>
}

export const LongUrl = ({
	textUrl,
	error,
	disabled,
	...registerProps
}: LongUrlProps) => {
	return (
		<div className="grid gap-2">
			<label
				htmlFor="longUrl"
				className="text-mariner-600 font-semibold text-sm"
			>
				{textUrl.label}
			</label>
			<div className="flex items-center gap-2">
				<div className="flex items-center gap-2 w-full">
					<Input
						id="longUrl"
						type="text"
						placeholder={textUrl.placeholder}
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
