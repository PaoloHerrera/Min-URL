import { Navbar } from '../navbar/Navbar.tsx'
import { Sidebar } from '../sidebar/Sidebar.tsx'
import type { JSX } from 'react'

export const DashboardLayout = ({ children }: { children: JSX.Element }) => {
	return (
		<div className="flex">
			<div className="w-80 h-screen border-r-1 border-decoration z-20 fixed bg-white hidden lg:block">
				<Sidebar />
			</div>

			<div className="flex-1 flex flex-col min-h-screen">
				<Navbar />
				<main className="bg-mariner-50 h-full lg:ml-80 mt-20">{children}</main>
			</div>
		</div>
	)
}
