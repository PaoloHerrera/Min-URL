/**
 * Safely extracts client IP from X-Forwarded-For header or socket remoteAddress
 * without explicit type assertions.
 */
export function extractClientIp(
	forwardedFor?: string | string[] | undefined,
	remoteAddress?: string | undefined,
): string {
	if (typeof forwardedFor === 'string' && forwardedFor.length > 0) {
		return forwardedFor.split(',')[0].trim()
	}
	if (Array.isArray(forwardedFor) && forwardedFor.length > 0) {
		return forwardedFor[0].trim()
	}
	return remoteAddress || 'unknown'
}
