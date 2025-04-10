import { Card, CardHeader, CardBody } from '@/modules/core/design-system/Card'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { NoData } from './NoData.tsx'
import { useTranslations } from '@/modules/core/hooks/useTranslations.ts'
import { useStatsStore } from '@/stores/statsStore.ts'
import type { PieChartProps } from '@/types.d'
import type { TooltipProps } from 'recharts/types/component/Tooltip'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export const DeviceBreakdown = () => {
	const { dashboard } = useTranslations()
	const { deviceTitle } = dashboard.content
	const { deviceStats } = useStatsStore()

	const data: PieChartProps[] = (deviceStats ?? []).map((entry, index) => ({
		name: entry?.name?.charAt(0).toUpperCase() + entry?.name?.slice(1),
		clicks: Number(entry.clicks),
		color: COLORS[index % COLORS.length],
		percent: entry.percent,
	}))

	return (
		<Card>
			<CardHeader>
				<div className="flex flex-row justify-between items-center">
					<span className="font-semibold text-mariner-950 opacity-70">
						{deviceTitle}
					</span>
				</div>
			</CardHeader>
			<CardBody>
				{data.length > 0 ? (
					<>
						<ResponsiveContainer width="100%" height={300}>
							<PieChart>
								<Pie
									data={data}
									cx="50%"
									cy="50%"
									innerRadius={80}
									dataKey="clicks"
								>
									{data.map((entry) => (
										<Cell key={`cell-${entry.name}`} fill={entry.color} />
									))}
								</Pie>
								<Tooltip content={<CustomTooltip />} />
							</PieChart>
						</ResponsiveContainer>

						<div className="flex flex-row justify-start mt-4">
							{data.map((entry) => (
								<div
									key={entry.name}
									className="flex items-center mr-4 justify-center w-full"
								>
									<div
										className="w-2.5 h-2 rounded-full mr-2"
										style={{ backgroundColor: entry.color }}
									/>
									<div className="flex justify-between w-full items-center">
										<span className="text-xs text-mariner-950 font-semibold">
											{entry.name} {entry.percent}%
										</span>
										<span className="text-xs text-mariner-950 opacity-70 ml-2 font-semibold">
											{entry.clicks} clicks
										</span>
									</div>
								</div>
							))}
						</div>
					</>
				) : (
					<NoData />
				)}
			</CardBody>
		</Card>
	)
}

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
	if (active && payload && payload.length > 0) {
		return (
			<div className="bg-white p-2 rounded-lg shadow-md">
				<p className="text-sm text-mariner-950 font-semibold">
					{`${payload[0].payload.name}`}
				</p>
				<p className="text-sm text-mariner-950 opacity-70">
					{`${payload[0].value} clicks (${payload[0].payload.percent}%)`}
				</p>
			</div>
		)
	}

	return null
}
