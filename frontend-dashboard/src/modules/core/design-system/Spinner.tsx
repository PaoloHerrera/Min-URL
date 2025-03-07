import { motion } from 'motion/react'

export const Spinner = () => {
	return (
		<motion.span
			animate={{ rotate: 360 }}
			transition={{
				repeat: Number.POSITIVE_INFINITY,
				duration: 1,
				ease: 'linear',
			}}
			style={{
				border: '5px solid var(--color-decoration)',
				borderTop: '5px solid var(--color-primary)',
				borderRadius: '50%',
				width: '16px',
				height: '16px',
				display: 'inline-block',
			}}
		/>
	)
}
