import type { GenericItemProps } from '@/modules/core/utils/types'
import { useTranslation } from '@/modules/core/hooks/useTranslation.ts'

// Componente de feature reutilizable
const FeatureItem = ({ icon: Icon, title, description }: GenericItemProps) => (
	<li className="flex flex-col gap-10">
		<div className="flex gap-2 items-center">
			<span className="border-2 rounded-full p-3 bg-mariner-200 border-mariner-300">
				<Icon />
			</span>
			<h3 className="font-bold text-mariner-950">{title}</h3>
		</div>
		<div className="flex flex-col justify-center">
			<p className="text-mariner-700 text-light">{description}</p>
		</div>
	</li>
)

// Componente principal
export const KeyFeatures = () => {
	const { t } = useTranslation()
	const features = t('features')

	return (
		<section className="md:px-32 px-4 min-h-[200px] flex flex-col justify-center">
			<ul className="grid grid-cols-1 justify-between xl:grid-cols-3 md:grid-cols-2 gap-10 py-10">
				{features.map((feature) => (
					<FeatureItem key={feature.id} {...feature} />
				))}
			</ul>
		</section>
	)
}
