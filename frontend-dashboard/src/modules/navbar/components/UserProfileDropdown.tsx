import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuItem,
	DropdownMenuSeparator,
} from '@/modules/core/ui/dropdown-menu.tsx'
import { LogOutIcon } from 'lucide-react'

import { useAuthStore } from '@/modules/core/stores/authStore'

export const UserProfileDropdown = ({ logout }: { logout: string }) => {
	const { user } = useAuthStore()
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild={true}>
				<div className="rounded-full h-10 w-10 cursor-pointer">
					{user?.avatar ? (
						<img src={user?.avatar} alt="avatar" className="rounded-full" />
					) : (
						<div className="w-full h-full text-mariner-50 bg-mariner-950">
							{user?.givenName?.charAt(0)}
						</div>
					)}
				</div>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="min-w-64">
				<DropdownMenuLabel>
					<div className="flex flex-row items-center gap-2 text-mariner-950">
						<div className="flex flex-col">
							<img
								src={user?.avatar}
								alt="avatar"
								className="rounded-full w-10 h-10"
							/>
						</div>
						<div>
							<p>{user?.displayName}</p>
							<p className="text-sm opacity-50">{user?.email}</p>
						</div>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />

				<DropdownMenuItem className="cursor-pointer">
					<LogOutIcon className="w-5 h-5 focus:text-mariner-50" />
					<span className="text-sm font-semibold">{logout}</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
