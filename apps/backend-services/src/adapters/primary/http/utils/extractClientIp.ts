/**
 * Safely extracts client IP from X-Forwarded-For header or socket remoteAddress
 * without explicit type assertions.
 *
 * Returns 'unknown' if the resolved value is empty or whitespace-only.
 */
export function extractClientIp(
	forwardedFor?: string | string[] | undefined,
	remoteAddress?: string | undefined,
): string {
	if (typeof forwardedFor === 'string') {
		const ip = forwardedFor.split(',')[0].trim()
		if (ip.length > 0) {
			return ip
		}
	}
	if (Array.isArray(forwardedFor) && forwardedFor.length > 0) {
		const ip = forwardedFor[0].trim()
		if (ip.length > 0) {
			return ip
		}
	}
	const remote = remoteAddress?.trim()
	return remote && remote.length > 0 ? remote : 'unknown'
}
