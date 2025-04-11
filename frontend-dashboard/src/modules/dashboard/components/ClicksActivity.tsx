import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
} from 'recharts'
import { Card, CardHeader, CardBody } from '@/modules/core/design-system/Card'
import type { Last7DaysClicksProps } from '@/types.d'
import { NoData } from './NoData.tsx'
import { useTranslations } from '@/modules/core/hooks/useTranslations.ts'
import { useStatsStore } from '@/stores/statsStore.ts'

const data: Last7DaysClicksProps[] = []
const FILL_COLOR = '#1971ce'

export const ClicksActivity = () => {
	const { dashboard } = useTranslations()
	const { last7DaysClicksTitle } = dashboard.content
	const { last7DaysClicks } = useStatsStore()

	if (last7DaysClicks) {
		data.push(...last7DaysClicks)
	}

	return (
		<Card>
			<CardHeader>
				<div className="flex flex-row justify-between items-center">
					<span className="font-semibold text-mariner-950 opacity-70">
						{last7DaysClicksTitle}
					</span>
				</div>
			</CardHeader>
			<CardBody>
				{data.length > 0 ? (
					<ResponsiveContainer width="100%" height={300}>
						<LineChart
							data={data}
							margin={{
								top: 5,
								right: 30,
								left: 20,
								bottom: 5,
							}}
						>
							<XAxis
								dataKey="createdAt"
								tickFormatter={(value) => value.split(' ')[0]}
							/>
							<YAxis type="number" />
							<Tooltip />
							<Line
								type="monotone"
								dataKey="clicks"
								stroke={FILL_COLOR}
								dot={false}
							/>
						</LineChart>
					</ResponsiveContainer>
				) : (
					<NoData />
				)}
			</CardBody>
		</Card>
	)
}
