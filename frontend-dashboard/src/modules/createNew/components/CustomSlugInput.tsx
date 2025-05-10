import { Input } from '@/modules/core/design-system/Input'
import { Spinner } from '@/modules/core/design-system/Spinner'
import { XIcon, CheckIcon } from 'lucide-react'
import type React from 'react'
import { useTranslations } from '@/modules/core/hooks/useTranslations.ts'
import { useSlugValidation } from '@/modules/createNew/hooks/useSlugValidation'

const MIN_LENGTH = 6
const MAX_LENGTH = 12

interface CustomSlugImputProps {
	value: string
	error?: string
	disabled?: boolean
	name: string
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	onBlur: (e: React.FocusEvent<HTMLInputElement>) => void
	ref: React.Ref<HTMLInputElement>
}

export const CustomSlugInput = ({
	value,
	error,
	...rest
}: CustomSlugImputProps) => {
	const { dashboard } = useTranslations()
	const { customSlug } = dashboard.navbar.dialogNewLink
	const { checkSlugStatus, loading } = useSlugValidation(value)

	const shouldCheckAvailability =
		!error &&
		value &&
		typeof value === 'string' &&
		value.length >= MIN_LENGTH &&
		value.length <= MAX_LENGTH

	return (
		<div className="grid gap-2">
			<label
				htmlFor="customSlug"
				className="text-mariner-600 font-semibold text-sm"
			>
				{customSlug.label}
			</label>
			<div className="flex items-center gap-2">
				<div className="flex items-center gap-2 w-full">
					<div className="flex-shrink-0 text-mariner-950">go.min-url.com/</div>

					<Input
						id="customSlug"
						type="text"
						placeholder={customSlug.placeholder}
						error={
							!!error ||
							(!checkSlugStatus.isAvailable &&
								typeof checkSlugStatus.error === 'string')
						}
						{...rest}
					/>
					{shouldCheckAvailability && loading && (
						<Spinner className="text-mariner-100 text-sm" />
					)}
					{shouldCheckAvailability &&
						!loading &&
						checkSlugStatus.isAvailable &&
						value &&
						typeof value === 'string' &&
						value.length >= MIN_LENGTH && (
							<CheckIcon size={20} className="w-5 h-5 text-success" />
						)}
					{shouldCheckAvailability &&
						!(loading || checkSlugStatus.isAvailable) &&
						typeof checkSlugStatus.error === 'string' && (
							<XIcon size={20} className="text-error" />
						)}
				</div>
			</div>
			<span className="text-xs text-error font-semibold text-center">
				{error || checkSlugStatus.error || ''}
			</span>
		</div>
	)
}
