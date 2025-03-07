import type React from 'react'
import type { LucideProps } from 'lucide-react'

export type Language = 'en' | 'es'

export type State = {
	lang: Language
}

export type LoginButtonProps = {
	icon:
		| React.ComponentType<React.SVGProps<SVGSVGElement>>
		| React.ComponentType<LucideProps>
	text: string
	link: string
}

export interface LoginProps {
	logo: React.ComponentType
	companyName: string
	title: string
	description: string
	buttons: LoginButtonProps[]
	footer: string
	terms: string
	conect: string
	privacy: string
}

export interface LoginCardProps {
	information: LoginProps
}

export interface Translations {
	login: LoginProps
}
