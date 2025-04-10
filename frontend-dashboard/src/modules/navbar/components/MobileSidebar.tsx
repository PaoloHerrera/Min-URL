import {
	Sheet,
	SheetTrigger,
	SheetContent,
	SheetTitle,
	SheetDescription,
	SheetHeader,
} from '@/modules/core/ui/sheet.tsx'
import { MenuIcon } from 'lucide-react'
import { SidebarTitle } from '@/modules/sidebar/components/SidebarTitle.tsx'
import { SidebarContent } from '@/modules/sidebar/components/SidebarContent'

export const MobileSidebar = () => {
	return (
		<div className="flex item-center lg:hidden">
			<Sheet>
				<SheetTrigger asChild={true}>
					<button
						type="button"
						className="rounded-full w-10 h-10 cursor-pointer flex items-center justify-center hover:bg-mariner-100"
					>
						<MenuIcon size={20} />
					</button>
				</SheetTrigger>
				<SheetContent side="left" className="w-80 flex flex-col h-full gap-4">
					<SheetHeader>
						<SheetTitle>
							<SidebarTitle />
						</SheetTitle>

						<SheetDescription>
							<span className="hidden">Min-URL Dashboard</span>
						</SheetDescription>
					</SheetHeader>
					<div className="px-4">
						<SidebarContent />
					</div>
				</SheetContent>
			</Sheet>
		</div>
	)
}
