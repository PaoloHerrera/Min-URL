type HeroHeader = {
	title: string
	subtitle: string
	className?: string
}

export const HeroHeader = ({ title, subtitle, className }: HeroHeader) => {
	return (
		<article className={`flex flex-col gap-8 h-full w-full ${className}`}>
			<h1 className="xl:text-8xl font-black text-left text-5xl text-mariner-600">
				{title}
			</h1>
			<p className="sm:text-xl font-normal text-left text-lg text-mariner-600 opacity-80">
				{subtitle}
			</p>
		</article>
	)
}
