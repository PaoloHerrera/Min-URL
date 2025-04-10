import type { TimeAgoTextProps } from '@/types'

export const getTimeAgo = (date: Date, timeAgoText: TimeAgoTextProps) => {
	const now = new Date()
	const diff = now.getTime() - date.getTime()
	const minutes = Math.floor(diff / (1000 * 60))
	const hours = Math.floor(diff / (1000 * 60 * 60))
	const days = Math.floor(diff / (1000 * 60 * 60 * 24))
	const weeks = Math.floor(diff / (1000 * 60 * 60 * 24 * 7))
	const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30))
	const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365))

	return getTimeAgoText({
		minutes,
		hours,
		days,
		weeks,
		months,
		years,
		timeAgoText,
	})
}

const getTimeAgoText = ({
	minutes,
	hours,
	days,
	weeks,
	months,
	years,
	timeAgoText,
}: {
	minutes: number
	hours: number
	days: number
	weeks: number
	months: number
	years: number
	timeAgoText: TimeAgoTextProps
}) => {
	if (minutes < 1) {
		return timeAgoText.now
	}
	if (minutes < 60) {
		return getMinutesText(minutes, timeAgoText.minute, timeAgoText.minutes)
	}
	if (hours < 24) {
		return getHoursText(hours, timeAgoText.hour, timeAgoText.hours)
	}
	if (days < 7) {
		return getDaysText(days, timeAgoText.day, timeAgoText.days)
	}
	if (weeks < 4) {
		return getWeeksText(weeks, timeAgoText.week, timeAgoText.weeks)
	}
	if (months < 12) {
		return getMonthsText(months, timeAgoText.month, timeAgoText.months)
	}
	return getYearsText(years, timeAgoText.year, timeAgoText.years)
}

const getMinutesText = (
	minutes: number,
	minuteText: string,
	minutesText: string,
) => {
	return minutes === 1 ? minuteText : `${minutes} ${minutesText}`
}

const getHoursText = (hours: number, hourText: string, hoursText: string) => {
	return hours === 1 ? hourText : `${hours} ${hoursText}`
}

const getDaysText = (days: number, dayText: string, daysText: string) => {
	return days === 1 ? dayText : `${days} ${daysText}`
}

const getWeeksText = (weeks: number, weekText: string, weeksText: string) => {
	return weeks === 1 ? weekText : `${weeks} ${weeksText}`
}

const getMonthsText = (
	months: number,
	monthText: string,
	monthsText: string,
) => {
	return months === 1 ? monthText : `${months} ${monthsText}`
}

const getYearsText = (years: number, yearText: string, yearsText: string) => {
	return years === 1 ? yearText : `${years} ${yearsText}`
}
