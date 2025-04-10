import { Navbar } from '../navbar/Navbar.tsx'
import { Sidebar } from '../sidebar/Sidebar.tsx'
import {
	ActivityIcon,
	LinkIcon,
	MousePointerIcon,
	PercentSquare,
} from 'lucide-react'
import { ClicksActivity } from './components/ClicksActivity.tsx'
import { GeographicDistribution } from './components/GeographicDistribution.tsx'
import { KpiCard } from './components/KpiCard.tsx'
import { DeviceBreakdown } from './components/DeviceBreakdown.tsx'
import { LinkCard } from '../link/components/LinkCard.tsx'
import { QrCodeCard } from '../qrcodes/components/QrCodeCard.tsx'
import { useDashboardData } from './hooks/useDashboardData.ts'

import clsx from 'clsx'

export const Dashboard = () => {
	const {
		basicStats,
		kpis,
		topLinksData,
		topQrCodesData,
		todayClicksColor,
		todayClicksPercentage,
		uniqueClicksColor,
		uniqueClicksPercentage,
	} = useDashboardData()

	const getGridClassName = (length: number) =>
		clsx('grid gap-10 sm:mx-10 m-4', {
			'xl:grid-cols-1': length === 1,
			'xl:grid-cols-2': length === 2,
			'xl:grid-cols-3': length >= 3,
			'md:grid-cols-1': length <= 2,
			'md:grid-cols-2': length === 3,
			'md:grid-cols-3': length > 3,
		})

	return (
		<div className="flex">
			<div className="w-80 h-screen border-r-1 border-decoration z-20 fixed bg-white hidden lg:block">
				<Sidebar />
			</div>

			<div className="flex-1 flex flex-col min-h-screen">
				<Navbar />
				<main className="bg-mariner-50 h-full lg:ml-80 mt-20">
					<div className="grid xl:grid-cols-4 md:grid-cols-2 gap-10 sm:m-10 m-4 grid-cols-1">
						<KpiCard
							title={kpis.totalClicks}
							icon={MousePointerIcon}
							value={basicStats?.totalClicks.total || 0}
						/>
						<KpiCard
							title={kpis.todayClicks}
							icon={ActivityIcon}
							value={basicStats?.todayClicks.total || 0}
							percentage={todayClicksPercentage}
							color={todayClicksColor}
						/>

						<KpiCard
							title={kpis.activeLinks}
							icon={LinkIcon}
							value={basicStats?.activeLinks.total || 0}
						/>

						<KpiCard
							title={kpis.percentageUniqueClicks}
							icon={PercentSquare}
							value={`${basicStats?.percentageUniqueClicks.total.toFixed(2) ?? 0}%`}
							percentage={uniqueClicksPercentage}
							color={uniqueClicksColor}
						/>
					</div>

					<div className="flex flex-col gap-10 m-4 sm:m-10">
						<ClicksActivity />
					</div>

					{/* Pie Charts */}
					<div className="grid xl:grid-cols-2 grid-cols-1 gap-10 sm:m-10 m-4">
						<GeographicDistribution />
						<DeviceBreakdown />
					</div>

					{/* Top Links */}

					{topLinksData.length > 0 && (
						<>
							<div className="sm:mx-10 m-4">
								<h3 className="text-mariner-950 font-semibold text-lg">
									Top Links
								</h3>
							</div>
							<div className={getGridClassName(topLinksData.length)}>
								{topLinksData.map((link) => (
									<LinkCard
										key={link.slug}
										title={link.title}
										clicks={link.clicks}
										shortUrl={link.shortUrl}
										slug={link.slug}
										longUrl={link.longUrl}
										createdAt={link.createdAt}
									/>
								))}
							</div>
						</>
					)}

					{/* Top QR Codes */}
					{topQrCodesData.length > 0 && (
						<>
							<div className="sm:mx-10 m-4">
								<h3 className="text-mariner-950 font-semibold text-lg">
									Top QR Codes
								</h3>
							</div>
							<div className={getGridClassName(topQrCodesData.length)}>
								{topQrCodesData.map((qrCode) => (
									<QrCodeCard
										key={qrCode.slug}
										title={qrCode.title}
										scans={qrCode.scans}
										shortUrl={qrCode.shortUrl}
										slug={qrCode.slug}
										longUrl={qrCode.url}
										foregroundColor={qrCode.foregroundColor}
										backgroundColor={qrCode.backgroundColor}
										createdAt={qrCode.createdAt}
									/>
								))}
							</div>
						</>
					)}
				</main>
			</div>
		</div>
	)
}
