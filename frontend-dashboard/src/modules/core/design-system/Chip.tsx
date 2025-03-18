import type React from 'react'

export const Chip = ({ children }: { children: React.ReactNode }) => {
	return (
		<span className="inline-flex items-center gap-2 rounded-xl bg-green-50 px-3 py-1 text-xs font-semibold text-success border border-success w-fit">
			{children}
		</span>
	)
}
