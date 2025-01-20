import { HOW_MIN_URL_IT_WORKS } from '@/constants'
import SingleItem from './SingleItem'
import './HowItWork.css'
import { motion, useScroll, useSpring } from 'motion/react'
import { useRef } from 'react'

export default function HowItWork() {
	const ref = useRef(null)

	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ['end end', 'start start'],
	})

	const scaleX = useSpring(scrollYProgress, {
		stiffness: 400,
		damping: 90,
		restDelta: 0.001,
	})

	return (
		<article className="w-full flex flex-col items-center py-2 secondary-color h-full">
			<div className="progress-container px-6 max-w-[1024px]" ref={ref}>
				<div className="progress">
					<h2 className="lg:text-6xl font-bold mt-10 md:text-5xl text-4xl">
						How it works:
					</h2>
					<motion.div
						style={{
							scaleX,
						}}
						className="progress-bar"
					/>
				</div>

				{HOW_MIN_URL_IT_WORKS.map((step) => (
					<SingleItem item={step} key={step.id} />
				))}
			</div>
		</article>
	)
}
