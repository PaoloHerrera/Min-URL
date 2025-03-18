import { useAuthStore } from '@/modules/core/stores/authStore'
import type { Language } from '@/types'

interface GreetingProps {
	greetings: { morning: string; afternoon: string; evening: string }
	language: Language
}

export const Greeting = ({ greetings, language }: GreetingProps) => {
	const { user } = useAuthStore()

	const currentDate = new Date()
	const options: Intl.DateTimeFormatOptions = {
		weekday: 'short',
		month: 'short',
		day: 'numeric',
	}
	const hour = currentDate.getHours()

	const getGreeting = () => {
		if (hour < 12) {
			return { emoji: '☀️', text: greetings.morning }
		}
		if (hour < 18) {
			return { emoji: '⛅', text: greetings.afternoon }
		}
		return { emoji: '🌙', text: greetings.evening }
	}

	const { emoji, text } = getGreeting()
	const formattedDate = currentDate.toLocaleDateString(language, options)

	return (
		<div className="flex flex-row gap-2">
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
