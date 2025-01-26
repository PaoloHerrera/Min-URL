import { Image } from "@heroui/react"
import './SingleImageItem.css'

export default function SingleImageItem({ item }) {
	return (
		<div className="sm:w-1/2 max-h-full min-h-[75%] h-full item-image-container">
			<Image
				isBlurred
				src={item.image}
				alt={item.title}
				width={400}
				className="h-full w-auto object-contain"
				loading="lazy"
			/>
		</div>
	)
}
