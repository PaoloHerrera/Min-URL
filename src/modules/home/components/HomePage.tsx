import { Hero } from './Hero/Hero.tsx'
import { KeyFeatures } from './KeyFeatures.tsx'
import { SmartSolutions } from './SmartSolutions/SmartSolutions.tsx'
import { FreeSection } from './FreeSection/FreeSection.tsx'

export const HomePage = () => {
	return (
		<main className="flex flex-col h-[200vh] relative top-[80px] w-full">
			<div>
				<Hero />
				<KeyFeatures />
				<SmartSolutions />
				<FreeSection />
			</div>
		</main>
	)
}
