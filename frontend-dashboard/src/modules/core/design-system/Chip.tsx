import type React from 'react'

export const Chip = ({
	children,
	color,
}: { children: React.ReactNode; color?: 'green' | 'red' | 'transparent' }) => {
	let className = ''
	if (color === 'green') {
		className = 'bg-green-500 text-white'
	} else if (color === 'red') {
		className = 'bg-red-500 text-white'
	} else {
		className = 'bg-transparent text-mariner-950'
	}

	return (
		<span
			className={`inline-flex items-center gap-2 rounded-xl px-3 py-1 text-xs font-semibold border w-fit ${className}`}
		>
			{children}
		</span>
	)
}
