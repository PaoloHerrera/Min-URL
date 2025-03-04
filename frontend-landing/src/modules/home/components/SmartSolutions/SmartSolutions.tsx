import { FeatureCard } from './FeatureCard.tsx'
import { useTranslation } from '@/modules/core/hooks/useTranslation.ts'

const SmartSolutionsHeader = ({
	header,
	subheader,
}: { header: string; subheader: string }) => {
	return (
		<>
			<span className="text-3xl font-extralight opacity-80">{subheader}</span>
			<h2 className="text-5xl font-extrabold">{header}</h2>
		</>
	)
}

export const SmartSolutions = () => {
	const { t } = useTranslation()
	const { header, subheader, content } = t('smartSolutions')

	return (
		<section className="flex flex-col items-center justify-center w-full py-24 bg-mariner-700 text-mariner-50 gap-10 px-4 md:px-32">
			<SmartSolutionsHeader header={header} subheader={subheader} />
			<div className="grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-2 gap-10 mt-20 w-full">
				{content.map((feature) => (
					<div
						key={feature.id}
						className="relative rounded-2xl h-full p-[4px] hover:before:absolute hover:before:top-[-50%] hover:before:left-[-50%] hover:before:right-[-50%] hover:before:bottom-[-50%] hover:before:bg-[conic-gradient(transparent,transparent,var(--color-success))] hover:transform md:hover:scale-105 transition-all duration-200 ease-in-out before:animate-spin-slow overflow-hidden"
					>
						<FeatureCard {...feature} />
					</div>
				))}
			</div>
		</section>
	)
}
