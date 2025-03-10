import { useStatsStore } from '../core/stores/statsStore.ts'

export const Dashboard = () => {
	const { shortUrls } = useStatsStore()

	return (
		<div className="flex flex-col items-center justify-center h-screen bg-mariner-50">
			<div className="flex flex-col items-center justify-center">
				<h1 className="text-3xl font-bold text-mariner-950">Dashboard</h1>
				<ul className="flex flex-col items-center justify-center text-mariner-500">
					{shortUrls?.map((shortUrl) => (
						<li key={shortUrl.slug}>
							<a href={shortUrl.shortUrl} target="_blank" rel="noreferrer">
								{shortUrl.shortUrl}
							</a>
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}
