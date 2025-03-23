import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from '@/modules/core/ui/dropdown-menu.tsx'
import { PlusIcon, LinkIcon, QrCodeIcon } from 'lucide-react'
import { useTranslations } from '@/modules/core/hooks/useTranslations.ts'

export const CreateNewDropdown = ({
	onLinkClick,
	onQrCodeClick,
}: {
	onLinkClick: () => void
	onQrCodeClick: () => void
}) => {
	const { dashboard } = useTranslations()
	const { createNew } = dashboard.navbar

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild={true}>
				<button
					className="bg-mariner-700 text-white xl:rounded-md xl:p-3 w-10 h-10 xl:w-auto flex items-center justify-center gap-2 cursor-pointer hover:opacity-90 rounded-full"
					type="button"
				>
					<PlusIcon className="w-5 h-5" />
					<span className="text-sm font-semibold hidden xl:block">
						{createNew.new}
					</span>
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="min-w-64">
				<DropdownMenuItem className="cursor-pointer" onClick={onLinkClick}>
					<LinkIcon className="w-5 h-5 focus:text-mariner-50" />
					<span className="text-sm font-semibold">{createNew.link}</span>
				</DropdownMenuItem>
				<DropdownMenuItem className="cursor-pointer" onClick={onQrCodeClick}>
					<QrCodeIcon className="w-5 h-5 focus:text-mariner-50" />
					<span className="text-sm font-semibold">{createNew.qrCode}</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
