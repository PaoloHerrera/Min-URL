import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuLabel,
} from '@/modules/core/ui/dropdown-menu.tsx'
import { BellIcon } from 'lucide-react'

export const NotificationsDropdown = ({ message }: { message: string }) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild={true}>
				<button className="cursor-pointer" type="button">
					<BellIcon className="w-5 h-5" />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="min-w-64">
				<DropdownMenuLabel>
					<p className="text-sm opacity-50 text-mariner-950">{message}</p>
				</DropdownMenuLabel>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
