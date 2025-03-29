import { UAParser } from 'ua-parser-js'

export const getDiviceType = (userAgent: string) => {
	if (!userAgent) {
		return null
	}
	const parser = new UAParser(userAgent)
	const deviceType = parser.getDevice().type || 'desktop'
	return deviceType
}
