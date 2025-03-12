import type React from 'react'
import { useState } from 'react'
import { Greeting } from './components/Greetings.tsx'
import { CreateNewDropdown } from './components/CreateNewDropdown.tsx'
import { SearchInput } from './components/SearchInput.tsx'
import { NotificationsDropdown } from './components/NotificationsDropdown.tsx'
import { UserProfileDropdown } from './components/UserProfileDropdown.tsx'
import {
	CreateLinkDialog,
	CreateQrCodeDialog,
} from './components/CreateDialog.tsx'

export const Navbar = () => {
	const [openDialogLink, setOpenDialogLink] = useState(false)
	const [openDialogQrCode, setOpenDialogQrCode] = useState(false)

	const handleShortUrlSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		//Lógica para crear un nuevo link
	}

	const handleQrCodeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		//Lógica para crear un nuevo código QR
	}

	return (
		<header className="py-4 px-10 border-b-1 border-decoration">
			<nav className="flex flex-row items-center justify-between">
				<Greeting />

				<div className="flex flex-row gap-20 items-center">
					<div className="flex flex-row gap-10 items-center">
						{/* Boton para crear un nuevo link */}
						<CreateNewDropdown
							onLinkClick={() => setOpenDialogLink(true)}
							onQrCodeClick={() => setOpenDialogQrCode(true)}
						/>
						<SearchInput />
						<NotificationsDropdown />
					</div>

					{/* Botón para ver tu perfil */}
					<UserProfileDropdown />
				</div>

				<CreateLinkDialog
					open={openDialogLink}
					onOpenChange={setOpenDialogLink}
					onSubmit={handleShortUrlSubmit}
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
