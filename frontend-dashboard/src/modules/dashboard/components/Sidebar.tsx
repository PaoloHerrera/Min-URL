import { SidebarTitle } from './SidebarTitle.tsx'
import { SidebarContent } from './SidebarContent.tsx'

export const Sidebar = () => {
	return (
		<aside className="w-full h-full">
			<div className="flex flex-col gap-10 h-full py-4 px-8">
				<SidebarTitle />
				<SidebarContent />
			</div>
		</aside>
	)
}
