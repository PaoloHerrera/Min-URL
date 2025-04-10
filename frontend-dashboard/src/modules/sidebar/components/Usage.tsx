import type React from 'react'
import type { LucideProps } from 'lucide-react'
import { Progress } from '@/modules/core/ui/progress'
import { useTranslations } from '@/modules/core/hooks/useTranslations'

interface UsageProps {
	title: string
	icon: React.ComponentType<LucideProps>
	used: number
	remaining: number
	max: number
}

export const Usage = ({
	title,
	icon: Icon,
	used,
	remaining,
	max,
}: UsageProps) => {
	const { dashboard } = useTranslations()
	const { usage } = dashboard.sidebar

	return (
		<article className="flex flex-col gap-2 w-full">
			<div className="flex gap-2 items-center">
				<Icon size={14} />
				<span className="text-sm font-semibold">{title}</span>
			</div>
			<Progress value={used} max={max} />
			<div className="flex justify-between">
				<span className="text-xs font-semibold opacity-70">
					{used} {usage.used}
				</span>
				<span className="text-xs font-semibold opacity-70">
					{remaining} {usage.remaining}
				</span>
			</div>
		</article>
	)
}
