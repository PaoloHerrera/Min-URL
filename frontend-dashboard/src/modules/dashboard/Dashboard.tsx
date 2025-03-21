import { useStatsStore } from '../core/stores/statsStore.ts'
import { Navbar } from '../navbar/Navbar.tsx'
import { Sidebar } from './components/Sidebar.tsx'
import { Card, CardBody, CardHeader } from '../core/design-system/Card.tsx'
import {
	ActivityIcon,
	LinkIcon,
	MousePointerIcon,
	QrCodeIcon,
} from 'lucide-react'
import { Chip } from '../core/design-system/Chip.tsx'

export const Dashboard = () => {
	const { basicStats } = useStatsStore()

	return (
		<div className="flex">
			<div className="w-80 h-screen border-r-1 border-decoration z-10 fixed bg-white hidden lg:block">
				<Sidebar />
			</div>

			<div className="flex-1 flex flex-col min-h-screen">
				<Navbar />
				<main className="bg-mariner-50 h-full lg:ml-80 mt-20">
					<div className="grid xl:grid-cols-4 md:grid-cols-2 gap-10 sm:m-10 m-4 grid-cols-1">
						<Card>
							<CardHeader>
								<div className="flex flex-row justify-between items-center">
									<span className="font-semibold text-mariner-950 opacity-70">
										Total Clicks/Scans
									</span>
									<MousePointerIcon className="w-5 h-5 text-mariner-500" />
								</div>
							</CardHeader>
							<CardBody>
								<div className="flex flex-row justify-between">
									<span className="text-mariner-950 font-extrabold text-2xl">
										{basicStats?.totalClicks.total}
									</span>
									<Chip>↑ {basicStats?.totalClicks.percentage}%</Chip>
								</div>
							</CardBody>
						</Card>

						<Card>
							<CardHeader>
								<div className="flex flex-row justify-between items-center">
									<span className="font-semibold text-mariner-950 opacity-70">
										Today Clicks/Scans
									</span>
									<ActivityIcon className="w-5 h-5 text-mariner-500" />
								</div>
							</CardHeader>
							<CardBody>
								<div className="flex flex-row justify-between">
									<span className="text-mariner-950 font-extrabold text-2xl">
										{basicStats?.todayClicks.total}
									</span>
									<Chip>↓ {basicStats?.todayClicks.percentage}%</Chip>
								</div>
							</CardBody>
						</Card>

						<Card>
							<CardHeader>
								<div className="flex flex-row justify-between items-center">
									<span className="font-semibold text-mariner-950 opacity-70">
										Active Links
									</span>
									<LinkIcon className="w-5 h-5 text-mariner-500" />
								</div>
							</CardHeader>
							<CardBody>
								<div className="flex flex-row justify-between">
									<span className="text-mariner-950 font-extrabold text-2xl">
										{basicStats?.activeLinks.total}
									</span>
									<Chip>↑ {basicStats?.activeLinks.percentage}%</Chip>
								</div>
							</CardBody>
						</Card>

						<Card>
							<CardHeader>
								<div className="flex flex-row justify-between items-center">
									<span className="font-semibold text-mariner-950 opacity-70">
										Active QR Codes
									</span>
									<QrCodeIcon className="w-5 h-5 text-mariner-500" />
								</div>
							</CardHeader>
							<CardBody>
								<div className="flex flex-row justify-between">
									<span className="text-mariner-950 font-extrabold text-2xl">
										{basicStats?.activeQrCodes.total}
									</span>
									<Chip>↑ {basicStats?.activeQrCodes.percentage}%</Chip>
								</div>
							</CardBody>
						</Card>
					</div>
				</main>
			</div>
		</div>
	)
}
