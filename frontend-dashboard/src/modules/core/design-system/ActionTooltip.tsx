import type React from 'react'
import {
	Tooltip,
	TooltipProvider,
	TooltipTrigger,
	TooltipContent,
} from '@/modules/core/ui/tooltip.tsx'

interface ActionTooltipProps {
	tooltipText: string
	children: React.ReactNode
}

export const ActionTooltip = ({
	tooltipText,
	children,
}: ActionTooltipProps) => {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger className="cursor-pointer" asChild={true}>
					{children}
				</TooltipTrigger>
				<TooltipContent className="bg-mariner-600 text-mariner-50">
					{tooltipText}
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}
