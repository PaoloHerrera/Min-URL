import { FeatureCard } from '@/modules/home/components/SmartSolutions/FeatureCard.tsx'
import { useTranslation } from '@/modules/core/hooks/useTranslation.ts'

const FreeSectionHeader = ({
	header,
	subheader,
}: { header: string; subheader: string }) => {
	return (
		<>
			<span className="text-3xl text-mariner-800 opacity-80">{subheader}</span>
			<h2 className="text-5xl font-extrabold">{header}</h2>
		</>
	)
}

export const FreeSection = () => {
	const { t } = useTranslation()
	const freeSection = t('freeSection')

	return (
		<section className="flex flex-col items-center justify-center w-full py-24 bg-mariner-50 text-mariner-950 gap-10 px-4 md:px-32">
			<FreeSectionHeader
				header={freeSection.header}
				subheader={freeSection.subheader}
			/>
			<div className="grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-2 gap-10 mt-20 w-full">
				{freeSection.content.map((feature) => (
					<div
						className="hover:transform hover:border-mariner-300 hover:scale-105 border-2 border-transparent rounded-2xl transition-all duration-200 ease-in-out hover:shadow-2xl"
						key={feature.id}
					>
						<FeatureCard {...feature} />
					</div>
				))}
			</div>
		</section>
	)
}
