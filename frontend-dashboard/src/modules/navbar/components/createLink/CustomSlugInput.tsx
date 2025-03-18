import { Input } from '@/modules/core/design-system/Input'
import { Spinner } from '@/modules/core/design-system/Spinner'
import { CheckIcon, XIcon } from 'lucide-react'
import { useDebounce } from '@/modules/core/hooks/useDebounce'
import { useCheckSlug } from '@/modules/core/hooks/useCheckSlug'
import type { DialogNewLinkProps } from '@/types'

interface CustomSlugImputProps {
	slug: string
	setSlug: (slug: string) => void
	dialogTexts: DialogNewLinkProps
}

export const CustomSlugInput = ({
	slug,
	setSlug,
	dialogTexts,
}: CustomSlugImputProps) => {
	const debouncedSlug = useDebounce(slug, 500)
	const { isAvailable, loading } = useCheckSlug({ slug: debouncedSlug })

	return (
		<div className="grid gap-2">
			<label
				htmlFor="customSlug"
				className="text-mariner-600 font-semibold text-sm"
			>
				{dialogTexts.customSlug.label}
			</label>
			<div className="flex items-center gap-2">
				<div className="flex items-center gap-2 w-full">
					<div className="flex-shrink-0 text-mariner-950">go.min-url.com/</div>

					<Input
						id="customSlug"
						placeholder={dialogTexts.customSlug.placeholder}
						onChange={(e) => setSlug(e.target.value)}
						error={!isAvailable.isAvailable && slug.length > 0}
					/>

					{loading && (
						<div className="flex items-center gap-2">
							<div className="flex-shrink-0">
								<Spinner className="text-mariner-100 text-sm" />
							</div>
						</div>
					)}
					{!loading && isAvailable.isAvailable && slug.length > 0 && (
						<div className="flex items-center gap-2">
							<div className="flex-shrink-0">
								<CheckIcon className="w-5 h-5 text-success" />
							</div>
						</div>
					)}
					{!(loading || isAvailable.isAvailable) && slug.length > 0 && (
						<div className="flex items-center gap-2">
							<div className="flex-shrink-00">
								<XIcon className="w-5 h-5 text-error" />
							</div>
						</div>
					)}
				</div>
			</div>
			<span className="text-xs text-error font-semibold text-center">
				{isAvailable.message}
			</span>
		</div>
	)
}
