export default function SingleTextItem({ item }) {
	return (
		<div className="flex flex-col pr-6 items-center justify-center sm:w-1/2 pb-10">
			<h3 className="text-lg font-bold lg:text-3xl text-[#1d4980]">
				{item.icon}
				{item.title}
			</h3>
		</div>
	)
}
