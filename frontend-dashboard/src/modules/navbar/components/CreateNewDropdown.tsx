import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from '@/modules/core/ui/dropdown-menu.tsx'
import { PlusIcon, LinkIcon, QrCodeIcon } from 'lucide-react'

export const CreateNewDropdown = ({
	onLinkClick,
	onQrCodeClick,
}: { onLinkClick: () => void; onQrCodeClick: () => void }) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild={true}>
				<button
					className="bg-mariner-700 text-white rounded-md px-3 py-3 flex items-center gap-2 cursor-pointer hover:opacity-90"
					type="button"
				>
					<PlusIcon className="w-5 h-5" />
					<span className="text-sm font-semibold hidden xl:block">
						Create new
					</span>
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="min-w-64">
				<DropdownMenuItem className="cursor-pointer" onClick={onLinkClick}>
					<LinkIcon className="w-5 h-5 focus:text-mariner-50" />
					<span className="text-sm font-semibold">Link</span>
				</DropdownMenuItem>
				<DropdownMenuItem className="cursor-pointer" onClick={onQrCodeClick}>
					<QrCodeIcon className="w-5 h-5 focus:text-mariner-50" />
					<span className="text-sm font-semibold">QR Code</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
