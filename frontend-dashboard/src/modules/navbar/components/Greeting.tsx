import { useGreetings } from '@/modules/navbar/hooks/useGreetings'
interface GreetingProps {
	greetings: { morning: string; afternoon: string; evening: string }
}

export const Greeting = ({ greetings }: GreetingProps) => {
	const { emoji, text, formattedDate, user } = useGreetings(greetings)

	return (
		<div className="lg:flex flex-row gap-2 hidden">
			<div className="flex flex-col">{emoji}</div>
			<div className="flex flex-col">
				<p className="font-bold text-mariner-950">
					{text}, {user?.givenName}
				</p>
				<p className="text-sm text-mariner-950 font-semibold opacity-70">
					{formattedDate}
				</p>
			</div>
		</div>
	)
}
