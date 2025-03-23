import { Greeting } from './components/Greetings.tsx'
import { CreateNewDropdown } from './components/CreateNewDropdown.tsx'
import { SearchInput } from './components/SearchInput.tsx'
import { NotificationsDropdown } from './components/NotificationsDropdown.tsx'
import { UserProfileDropdown } from './components/UserProfileDropdown.tsx'
import { CreateQrCodeDialog } from './components/CreateDialog.tsx'
import { CreateLinkDialog } from '@/modules/createNew/CreateLinkDialog.tsx'
import { useDialogStore } from '@/stores/dialogStore.ts'
import { useTranslations } from '@/modules/core/hooks/useTranslations.ts'
import { SuccessLink } from '@/modules/createNew/components/SuccessLink.tsx'
import { MobileSidebar } from './components/MobileSidebar.tsx'

export const Navbar = () => {
	const { setOpenDialogLink, openDialogQrCode, setOpenDialogQrCode } =
		useDialogStore()
	const { dashboard } = useTranslations()
	const { navbar } = dashboard

	return (
		<header className="py-4 sm:px-10 px-4 border-b-1 border-decoration fixed bg-white lg:w-[calc(100vw-20rem)] lg:ml-80 h-20 z-10 w-full">
			<nav className="flex flex-row items-center justify-between">
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
			<CreateLinkDialog />
			<CreateQrCodeDialog
				open={openDialogQrCode}
				onOpenChange={setOpenDialogQrCode}
			/>
			<SuccessLink />
		</header>
	)
}
