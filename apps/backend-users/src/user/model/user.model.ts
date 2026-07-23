export interface User {
	idUsers: number
	googleId?: string
	githubId?: string
	displayName?: string
	givenName?: string
	familyName?: string
	email: string
	avatar?: string
	shortUrlUsage: number
	shortUrlAvailable: number
	qrCodeUsage: number
	qrCodeAvailable: number
	deleted: boolean
	createdAt: Date
	updatedAt: Date
	deletedAt?: Date
}
