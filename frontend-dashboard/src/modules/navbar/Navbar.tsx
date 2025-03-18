import type React from 'react'
import { useState } from 'react'
import { Greeting } from './components/Greetings.tsx'
import { CreateNewDropdown } from './components/CreateNewDropdown.tsx'
import { SearchInput } from './components/SearchInput.tsx'
import { NotificationsDropdown } from './components/NotificationsDropdown.tsx'
import { UserProfileDropdown } from './components/UserProfileDropdown.tsx'
import { CreateQrCodeDialog } from './components/CreateDialog.tsx'
import { CreateLinkDialog } from './components/createLink/CreateLinkDialog.tsx'
import { LanguageSelector } from './components/LanguageSelector.tsx'
import { useLanguageStore } from '../core/stores/languageStore.ts'
import { translations } from '../core/i18n/index.ts'

export const Navbar = () => {
	const [openDialogLink, setOpenDialogLink] = useState(false)
	const [openDialogQrCode, setOpenDialogQrCode] = useState(false)

	const { language } = useLanguageStore()
	const { navbar } = translations[language].dashboard

	const handleShortUrlSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		//Lógica para crear un nuevo link
	}

	const handleQrCodeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		//Lógica para crear un nuevo código QR
	}

	return (
		<header className="py-4 px-10 border-b-1 border-decoration fixed bg-white w-[calc(100vw-24rem)] ml-96 h-20 z-10">
			<nav className="flex flex-row items-center justify-between">
				<Greeting greetings={navbar.greetings} language={language} />

				<div className="flex flex-row gap-20 items-center">
					<div className="flex flex-row gap-10 items-center">
						{/* Boton para crear un nuevo link */}
						<CreateNewDropdown
							onLinkClick={() => setOpenDialogLink(true)}
							onQrCodeClick={() => setOpenDialogQrCode(true)}
							createNew={navbar.createNew}
						/>
						<SearchInput placeholder={navbar.search} />
						{/* Selector de idioma */}
						<LanguageSelector />
						<NotificationsDropdown message={navbar.notifications.empty} />
					</div>

					{/* Botón para ver tu perfil */}
					<UserProfileDropdown logout={navbar.profile.logout} />
				</div>

				<CreateLinkDialog
					open={openDialogLink}
					onOpenChange={setOpenDialogLink}
					onSubmit={handleShortUrlSubmit}
					dialogTexts={navbar.dialogNewLink}
				/>

				<CreateQrCodeDialog
					open={openDialogQrCode}
					onOpenChange={setOpenDialogQrCode}
					onSubmit={handleQrCodeSubmit}
				/>
			</nav>
		</header>
	)
}
