export type Strategy = 'google' | 'github'

export interface OauthProfile {
	id: string
	displayName: string
	emails: { value: string }[]
}
