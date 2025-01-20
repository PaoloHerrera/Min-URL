export default function SingleStep({ item }) {
	return (
		<section
			key={item.id}
			className="flex items-center mt-5 gap-10 px-6 lg:w-[1024px]"
		>
			<div className="w-full pt-32 flex flex-col gap-10 lg:flex-row h-full justify-center items-center">
				<div className="lg:w-1/2 h-3/4 w-auto">
					<img src={item.image} alt={item.title} className="h-full w-auto" />
				</div>
				<div className="flex flex-col pr-6 items-center justify-center lg:w-1/2">
					<h3 className="text-xl font-bold lg:text-3xl">{item.title}</h3>
				</div>
			</div>
		</section>
	)
}
