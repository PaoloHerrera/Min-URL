import { useStatsStore } from '../core/stores/statsStore.ts'
import { useAuthStore } from '../core/stores/authStore.ts'
import { Navbar } from '../navbar/Navbar.tsx'
import { Sidebar } from './components/Sidebar.tsx'

export const Dashboard = () => {
	const { user } = useAuthStore()
	const { shortUrls } = useStatsStore()

	return (
		<div className="flex">
			<div className="w-96 h-screen border-r-1 border-decoration z-10 ">
				<Sidebar />
			</div>

			<div className="flex-1 flex flex-col">
				<Navbar />
				<main className="flex flex-col items-center justify-center bg-mariner-50 h-full">
					<h1 className="text-3xl font-bold text-mariner-950">Dashboard</h1>
					<p className="text-xl font-bold text-mariner-950">
						{user?.displayName}
					</p>
					<p className="text-xl font-bold text-mariner-950">{user?.email}</p>
					<ul className="flex flex-col items-center justify-center text-mariner-500">
						{shortUrls?.map((shortUrl) => (
							<li key={shortUrl.slug}>
								<a href={shortUrl.shortUrl} target="_blank" rel="noreferrer">
									{shortUrl.shortUrl}
								</a>
							</li>
						))}
					</ul>
				</main>
			</div>
		</div>
	)
}
