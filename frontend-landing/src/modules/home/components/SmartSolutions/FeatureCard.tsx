import type React from 'react'
import { Card, CardHeader, CardBody } from '@/modules/core/design-system/Card'
import type { LucideProps } from 'lucide-react'

type FeatureCardProps = {
	icon: React.ComponentType<LucideProps>
	title: string
	description: string
}

export const FeatureCard = ({
	icon: Icon,
	title,
	description,
}: FeatureCardProps) => {
	return (
		<Card>
			<CardHeader>
				<span className="border-2 rounded-md p-3 bg-mariner-100 border-mariner-100 inline-flex">
					<Icon className="stroke-mariner-700 w-6 h-6" />
				</span>
			</CardHeader>
			<CardBody>
				<h3 className="text-xl font-bold text-mariner-950">{title}</h3>
				<p className="text-mariner-700 text-light">{description}</p>
			</CardBody>
		</Card>
	)
}
