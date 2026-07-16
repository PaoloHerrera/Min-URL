import { useAuthStore } from '@/stores/authStore'
import { useLanguageStore } from '@/stores/languageStore'

export const useGreetings = (greetings: {
	morning: string
	afternoon: string
	evening: string
}) => {
	const { user } = useAuthStore()
	const { language } = useLanguageStore()

	const currentDate = new Date()
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
	const formattedDate = currentDate.toLocaleDateString(language, {
		weekday: 'short',
		month: 'short',
		day: 'numeric',
	})

	return {
		emoji,
		text,
		formattedDate,
		user,
	}
}
