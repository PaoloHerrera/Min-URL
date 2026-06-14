import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/modules/core/ui/tooltip.tsx'
import type React from 'react'

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
