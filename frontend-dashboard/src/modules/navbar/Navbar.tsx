import type React from 'react'
import { useState } from 'react'
import { Greeting } from './components/Greetings.tsx'
import { CreateNewDropdown } from './components/CreateNewDropdown.tsx'
import { SearchInput } from './components/SearchInput.tsx'
import { NotificationsDropdown } from './components/NotificationsDropdown.tsx'
import { UserProfileDropdown } from './components/UserProfileDropdown.tsx'
import { CreateQrCodeDialog } from './components/CreateDialog.tsx'
import { CreateLinkDialog } from '@/modules/createNew/CreateLinkDialog.tsx'
import { useLanguageStore } from '../core/stores/languageStore.ts'
import { translations } from '../core/i18n/index.ts'
import { MobileSidebar } from './components/MobileSidebar.tsx'

export const Navbar = () => {
	const [openDialogLink, setOpenDialogLink] = useState(false)
	const [openDialogQrCode, setOpenDialogQrCode] = useState(false)

	const { language } = useLanguageStore()
	const { navbar } = translations[language].dashboard

	const handleQrCodeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		//Lógica para crear un nuevo código QR
	}

	return (
		<header className="py-4 sm:px-10 px-4 border-b-1 border-decoration fixed bg-white lg:w-[calc(100vw-20rem)] lg:ml-80 h-20 z-10 w-full">
			<nav className="flex flex-row items-center justify-between">
				<Greeting greetings={navbar.greetings} language={language} />

				<MobileSidebar />

				<div className="flex flex-row sm:gap-10 gap-4 items-center">
					<SearchInput placeholder={navbar.search} />
					{/* Boton para crear un nuevo link */}
					<CreateNewDropdown
						onLinkClick={() => setOpenDialogLink(true)}
						onQrCodeClick={() => setOpenDialogQrCode(true)}
						createNew={navbar.createNew}
					/>

					<NotificationsDropdown message={navbar.notifications.empty} />
					{/* Botón para ver el perfil */}
					<UserProfileDropdown textProfile={navbar.profile} />
				</div>
			</nav>
			<CreateLinkDialog
				open={openDialogLink}
				onOpenChange={setOpenDialogLink}
				dialogTexts={navbar.dialogNewLink}
			/>
			<CreateQrCodeDialog
				open={openDialogQrCode}
				onOpenChange={setOpenDialogQrCode}
				onSubmit={handleQrCodeSubmit}
			/>
		</header>
	)
}
