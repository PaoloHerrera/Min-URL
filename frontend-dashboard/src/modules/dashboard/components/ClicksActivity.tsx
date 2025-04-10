import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
} from 'recharts'
import { Card, CardHeader, CardBody } from '@/modules/core/design-system/Card'
import type { ChartDataProps } from '@/types.d'
import { NoData } from './NoData.tsx'
import { useTranslations } from '@/modules/core/hooks/useTranslations.ts'

const data: ChartDataProps[] = []
const FILL_COLOR = '#1971ce'

export const ClicksActivity = () => {
	const { dashboard } = useTranslations()
	const { last7DaysClicksTitle } = dashboard.content

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
						<BarChart
							data={data}
							margin={{
								top: 5,
								right: 30,
								left: 20,
								bottom: 5,
							}}
						>
							<XAxis dataKey="name" />
							<YAxis />
							<Tooltip />
							<Bar dataKey="clicks" fill={FILL_COLOR} />
						</BarChart>
					</ResponsiveContainer>
				) : (
					<NoData />
				)}
			</CardBody>
		</Card>
	)
}
