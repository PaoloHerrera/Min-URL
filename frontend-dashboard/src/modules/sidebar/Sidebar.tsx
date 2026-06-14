import { SidebarContent } from './components/SidebarContent.tsx'
import { SidebarTitle } from './components/SidebarTitle.tsx'

export const Sidebar = () => {
	return (
		<aside className="w-full h-full flex flex-col justify-center items-start">
			<SidebarTitle />
			<SidebarContent />
		</aside>
	)
}
