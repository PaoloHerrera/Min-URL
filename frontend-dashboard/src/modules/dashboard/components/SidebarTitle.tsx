import { MinUrlIcon } from '@/modules/core/design-system/Icons.tsx'

export const SidebarTitle = () => {
	return (
		<header className="flex items-center gap-2 px-2">
			<MinUrlIcon />
			<h1 className="text-2xl font-bold text-mariner-500">Min-URL</h1>
		</header>
	)
}
