import { useAuthStore } from '@/modules/core/stores/authStore'

export const Greeting = () => {
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
			return { emoji: '☀️', text: 'Good morning' }
		}
		if (hour < 18) {
			return { emoji: '⛅', text: 'Good afternoon' }
		}
		return { emoji: '🌙', text: 'Good evening' }
	}

	const { emoji, text } = getGreeting()
	const formattedDate = currentDate.toLocaleDateString('en', options)

	return (
		<div className="flex flex-row gap-2">
			<div className="flex flex-col">{emoji}</div>
			<div className="flex flex-col">
				<p className="font-bold text-mariner-950">
					{text}, {user?.givenName}
				</p>
				<p className="text-sm text-mariner-950 font-semibold opacity-60">
					{formattedDate}
				</p>
			</div>
		</div>
	)
}
