import { Image } from '@nextui-org/react'
import './SingleImageItem.css'

export default function SingleImageItem({ item }) {
	return (
		<div className="lg:w-1/2 max-h-full min-h-[75%] w-auto item-image-container">
			<Image
				isBlurred
				src={item.image}
				alt={item.title}
				width={500}
				className="h-full w-auto"
			/>
		</div>
	)
}
