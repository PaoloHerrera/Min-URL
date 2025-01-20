import { HOW_MIN_URL_IT_WORKS } from '@/constants'
import SingleItem from './SingleItem'
import './HowItWork.css'

export default function HowItWork() {
	return (
		<article className="w-full flex flex-col items-center py-2 secondary-color h-full">
			<div className="progress">
				<h2 className="lg:text-6xl font-bold mt-10 md:text-5xl text-4xl">
					How it works:
				</h2>
			</div>

			{HOW_MIN_URL_IT_WORKS.map((step) => (
				<SingleItem item={step} key={step.id} />
			))}
		</article>
	)
}
