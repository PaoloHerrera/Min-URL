import SingleImageItem from './SingleImageItem'
import SingleTextItem from './SingleTextItem'

export default function SingleItem({ item }) {
	return (
		<section key={item.id} className="flex items-center mt-5 gap-10 w-full">
			<div className="w-full pt-28 flex flex-col gap-10 sm:flex-row h-full justify-center items-center">
				<SingleImageItem item={item} />
				<SingleTextItem item={item} />
			</div>
		</section>
	)
}
