import type { GenerationMode } from '@/modules/core/utils/types.d.ts'
import { RightArrowIcon } from '@/modules/core/design-system/Icons.tsx'
import { Spinner } from '@/modules/core/design-system/Spinner.tsx'

interface ButtonContentProps {
	isLoading: boolean
	activeMode: GenerationMode
	buttons: Record<GenerationMode, string>
	generating: string
}

export const ButtonContent = ({
	isLoading,
	activeMode,
	buttons,
	generating,
}: ButtonContentProps) => {
	return (
		<>
			{isLoading ? (
				<>
					<Spinner />
					<span>{generating}</span>
				</>
			) : (
				<span className="flex items-center gap-2">
					{buttons[activeMode]} <RightArrowIcon />
				</span>
			)}
		</>
	)
}
