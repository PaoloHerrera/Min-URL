import type React from 'react'

export const CodeCard = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			<header className="sticky top-0 bg-mariner-800 opacity-50 h-10 w-full rounded-t-2xl">
				<div className="flex items-center gap-2 mx-4 h-full">
					<div className="h-3 w-3 rounded-full bg-red-500" />
					<div className="h-3 w-3 rounded-full bg-yellow-500" />
					<div className="h-3 w-3 rounded-full bg-green-500" />
				</div>
			</header>
			<pre className="overflow-x-auto">
				<code>{children}</code>
			</pre>
		</>
	)
}
