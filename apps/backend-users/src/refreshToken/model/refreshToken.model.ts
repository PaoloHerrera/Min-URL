export interface RefreshToken {
	idRefreshTokens: number
	userId: number
	refreshToken: string
	expired: boolean
	expiresAt: Date
	createdAt: Date
	updatedAt: Date
	expiredAt?: Date
}
