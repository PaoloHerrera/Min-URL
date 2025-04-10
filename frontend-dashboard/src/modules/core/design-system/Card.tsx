import type React from 'react'

export const Card = ({ children }: { children: React.ReactNode }) => {
	return (
		<article className="flex flex-col gap-5 bg-white rounded-2xl p-6 relative justify-center items-center h-full w-full">
			{children}
		</article>
	)
}

export const CardHeader = ({ children }: { children: React.ReactNode }) => {
	return <header className="w-full relative">{children}</header>
}

export const CardBody = ({
	children,
	className = '',
}: { children: React.ReactNode; className?: string }) => {
	return (
		<div className={`flex flex-col gap-5 w-full ${className}`}>{children}</div>
	)
}

export const CardFooter = ({ children }: { children: React.ReactNode }) => {
	return <footer className="gap-5 w-full">{children}</footer>
}
