import { useTranslations } from '@/modules/core/hooks/useTranslations'

export const NoData = () => {
	const { dashboard } = useTranslations()
	const { noData } = dashboard.content

	return (
		<div className="flex flex-col gap-5 w-full h-[300px] justify-center items-center">
			<div className="flex flex-row justify-between items-center">
				<span className="font-medium text-mariner-950 opacity-70">
					{noData}
				</span>
			</div>
		</div>
	)
}
