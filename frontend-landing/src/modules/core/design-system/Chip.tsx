import type React from 'react'

export const Chip = ({ children }: { children: React.ReactNode }) => {
	return (
		<span className="inline-flex items-center gap-2 rounded-xl bg-mariner-800 px-3 py-1 text-sm font-semibold text-mariner-50 border border-mariner-800 w-fit">
			{children}
		</span>
	)
}
