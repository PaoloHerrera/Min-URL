import { Greeting } from './components/Greetings.tsx'
import { CreateNewDropdown } from './components/CreateNewDropdown.tsx'
import { SearchInput } from './components/SearchInput.tsx'
import { NotificationsDropdown } from './components/NotificationsDropdown.tsx'
import { UserProfileDropdown } from './components/UserProfileDropdown.tsx'
import { useDialogStore } from '@/stores/dialogStore.ts'
import { useTranslations } from '@/modules/core/hooks/useTranslations.ts'
import { SuccessLink } from '@/modules/createNew/components/SuccessLink.tsx'
import { SuccessQrCode } from '@/modules/createNew/components/SuccessQrCode.tsx'
import { MobileSidebar } from './components/MobileSidebar.tsx'
import { CreateNew } from '../createNew/index.tsx'
import { CreateLinkForm } from '../createNew/components/CreateLinkForm.tsx'
import { CreateQrCodeForm } from '../createNew/components/CreateQrCodeForm.tsx'

export const Navbar = () => {
	const {
		openDialogLink,
		openDialogQrCode,
		setOpenDialogLink,
		setOpenDialogQrCode,
	} = useDialogStore()
	const { dashboard } = useTranslations()
	const { navbar } = dashboard

	const { dialogNewLink, dialogNewQr } = dashboard.navbar

	return (
		<header className="py-4 sm:px-10 px-4 border-b-1 border-decoration fixed bg-white lg:pl-80 h-20 z-10 w-full">
			<nav className="flex flex-row items-center justify-between sm:ml-10 ml-4">
				<Greeting greetings={navbar.greetings} />
				<MobileSidebar />
				<div className="flex flex-row sm:gap-10 gap-4 items-center">
					<SearchInput placeholder={navbar.search} />
					<CreateNewDropdown
						onLinkClick={() => setOpenDialogLink(true)}
						onQrCodeClick={() => setOpenDialogQrCode(true)}
					/>
					<NotificationsDropdown message={navbar.notifications.empty} />
					<UserProfileDropdown textProfile={navbar.profile} />
				</div>
			</nav>

			{/* Create New Link */}
			<CreateNew
				open={openDialogLink}
				setOpen={setOpenDialogLink}
				title={dialogNewLink.title}
				description={dialogNewLink.description}
			>
				<CreateLinkForm onClose={async () => setOpenDialogLink(false)} />
			</CreateNew>

			{/* Create New QR Code */}
			<CreateNew
				open={openDialogQrCode}
				setOpen={setOpenDialogQrCode}
				title={dialogNewQr.title}
				description={dialogNewQr.description}
			>
				<CreateQrCodeForm onClose={async () => setOpenDialogQrCode(false)} />
			</CreateNew>

			<SuccessLink />
			<SuccessQrCode />
		</header>
	)
}
