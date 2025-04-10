import { SidebarTitle } from './components/SidebarTitle.tsx'
import { SidebarContent } from './components/SidebarContent.tsx'

export const Sidebar = () => {
	return (
		<aside className="w-full h-full flex flex-col justify-center items-start">
			<SidebarTitle />
			<SidebarContent />
		</aside>
	)
}
