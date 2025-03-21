import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuGroup,
	DropdownMenuSub,
	DropdownMenuSubTrigger,
	DropdownMenuPortal,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuSubContent,
} from '@/modules/core/ui/dropdown-menu.tsx'
import { LanguagesIcon, LogOutIcon } from 'lucide-react'

import { useAuthStore } from '@/modules/core/stores/authStore'
import { useLanguageStore } from '@/modules/core/stores/languageStore'
import { VITE_LOGOUT_LINK } from '@/constants'

interface UserProfileDropdownProps {
	textProfile: {
		title: string
		language: string
		logout: string
	}
}

export const UserProfileDropdown = ({
	textProfile,
}: UserProfileDropdownProps) => {
	const { user } = useAuthStore()
	const { language, setLanguage } = useLanguageStore()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild={true}>
				<div className="rounded-full h-10 w-10 cursor-pointer flex items-center justify-center bg-mariner-950 text-mariner-50 font-semibold">
					{user?.avatar ? (
						<img
							src={user?.avatar}
							alt="avatar"
							className="rounded-full w-full h-full"
						/>
					) : (
						<span>{user?.givenName?.charAt(0)}</span>
					)}
				</div>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="min-w-64">
				<DropdownMenuLabel>
					<div className="flex flex-col">
						<p className="font-semibold">{user?.displayName}</p>
						<p className="text-sm opacity-50">{user?.email}</p>
					</div>
				</DropdownMenuLabel>

				<DropdownMenuSeparator />

				<DropdownMenuGroup>
					<DropdownMenuSub>
						<DropdownMenuSubTrigger className="w-full">
							<LanguagesIcon
								size={16}
								className="text-mariner-600 mr-5 font-semibold"
							/>
							<span className="text-sm font-semibold text-mariner-600">
								{textProfile.language} ({language.toUpperCase()})
							</span>
						</DropdownMenuSubTrigger>
						<DropdownMenuPortal>
							<DropdownMenuSubContent>
								<DropdownMenuItem
									onClick={() => setLanguage('en')}
									className="cursor-pointer text-mariner-600 font-semibold"
								>
									English
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => setLanguage('es')}
									className="cursor-pointer text-mariner-600 font-semibold"
								>
									Español
								</DropdownMenuItem>
							</DropdownMenuSubContent>
						</DropdownMenuPortal>
					</DropdownMenuSub>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem>
					<a
						className="cursor-pointer flex flex-row w-full"
						href={VITE_LOGOUT_LINK}
					>
						<LogOutIcon size={16} className="text-error mr-5" />
						<span className="text-sm font-semibold text-error">
							{textProfile.logout}
						</span>
					</a>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
