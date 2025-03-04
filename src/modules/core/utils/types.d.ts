import type React from 'react'
import type { ColorsWebsite } from './constants.ts'
import type { LucideProps } from 'lucide-react'

declare global {
	interface Window {
		grecaptcha: {
			ready: (callback: () => void) => void
			execute: (
				siteKey: string,
				options: Record<string, string>,
			) => Promise<string>
		}
	}
}

export type Colors = keyof typeof ColorsWebsite

//Tipo explícito para la generación de URLs
export type GenerationMode = 'shorturl' | 'qrcode'
export type Language = 'en' | 'es'

export type IconProps = {
	fillColor: Colors
	backgroundColor: Colors
	borderColor: Colors
}

type HeroSectionProps = {
	header: Record<string, string>
	modes: Record<string, string>
	buttons: Record<string, string>
	formLabels: Record<string, string>
	common: Record<string, string>
	error: Record<string, string>
	code: string
}

export type GenericItemProps = {
	id: string
	title: string
	icon: React.ComponentType<LucideProps>
	description: string
}

export type GenericSectionProps = {
	header: string
	subheader: string
	content: GenericItemProps[]
}

type NavbarLinksProps = {
	home: string
	features: string
	pricing: string
}

type NavbarButtonsProps = {
	language: string
	signUp: string
	signIn: string
}

export type Translations = {
	navbarLinks: NavbarLinksProps
	navbarButtons: NavbarButtonsProps
	hero: HeroSectionProps
	features: GenericItemProps[]
	smartSolutions: GenericSectionProps
	freeSection: GenericSectionProps
}
