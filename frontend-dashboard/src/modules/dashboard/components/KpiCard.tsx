import { Card, CardHeader, CardBody } from '@/modules/core/design-system/Card'
import { MinusIcon, ArrowUpIcon, ArrowDownIcon } from 'lucide-react'
import type { LucideProps } from 'lucide-react'
import type React from 'react'
import { Chip } from '@/modules/core/design-system/Chip'
import type { JSX } from 'react'

interface KpiProps {
	title: string
	icon: React.ComponentType<LucideProps>
	value: number | string
	percentage?: number | null
	color?: 'green' | 'red' | 'transparent'
}

export const KpiCard = ({
	title,
	icon: Icon,
	value,
	percentage = null,
	color,
}: KpiProps): JSX.Element => {
	let arrow = <MinusIcon size={12} strokeWidth={3} />
	arrow = color === 'green' ? <ArrowUpIcon size={12} strokeWidth={3} /> : arrow
	arrow = color === 'red' ? <ArrowDownIcon size={12} strokeWidth={3} /> : arrow

	return (
		<Card>
			<CardHeader>
				<div className="flex flex-row justify-between items-center">
					<span className="font-semibold text-mariner-950 opacity-70">
						{title}
					</span>
					<Icon className="w-5 h-5 text-mariner-500" />
				</div>
			</CardHeader>
			<CardBody>
				<div className="flex flex-row justify-between">
					<span className="text-mariner-950 font-extrabold text-2xl">
						{value}
					</span>
					{percentage != null ? (
						<Chip color={color}>
							{arrow} {percentage}%
						</Chip>
					) : null}
				</div>
			</CardBody>
		</Card>
	)
}
