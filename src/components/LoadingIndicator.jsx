import { CircularProgress } from '@nextui-org/react'

export default function LoadingIndicator() {
	return (
		<div className="loading-indicator mt-5">
			<div className="grid grid-cols-1">
				<p>Generating Short URL, please wait...</p>
			</div>
			<div className="grid grid-cols-1 justify-items-center mt-3">
				<CircularProgress size="lg" aria-label="Loading..." />
			</div>
		</div>
	)
}
