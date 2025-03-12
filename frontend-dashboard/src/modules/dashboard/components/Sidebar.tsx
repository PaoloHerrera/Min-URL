import { MinUrlIcon } from '@/modules/core/design-system/Icons.tsx'
import { useLocation } from 'react-router'
import { HomeIcon, LinkIcon, QrCodeIcon } from 'lucide-react'

export const Sidebar = () => {
	// Get params from URL
	const location = useLocation()

	const currentPath = location.pathname

	const isDashboard = currentPath === '/'
	const isLink = currentPath === '/link'
	const isQrCode = currentPath === '/qrcode'

	return (
		<aside className="w-full h-full">
			<div className="flex flex-col gap-10 h-full py-4 px-8">
				<header className="flex flex-row items-center gap-2 justify-center">
					<MinUrlIcon />
					<h1 className="text-2xl font-bold text-mariner-500">Min-URL</h1>
				</header>
				<ul className="flex flex-col text-mariner-500 w-full gap-3">
					<a href="/" className="w-full">
						<li
							className={`${isDashboard ? 'bg-mariner-100 text-mariner-500' : 'text-mariner-950'}  rounded-md w-full flex items-center px-4 h-10 font-bold text-sm gap-2 hover:bg-mariner-50 hover:text-mariner-400`}
						>
							<HomeIcon className="w-5 h-5" />
							Dashboard
						</li>
					</a>
					<a href="/links" className="w-full">
						<li
							className={`${isLink ? 'bg-mariner-100' : 'text-mariner-950'} rounded-md w-full flex items-center px-4 h-10 font-bold text-sm gap-2 hover:bg-mariner-50 hover:text-mariner-400`}
						>
							<LinkIcon className="w-5 h-5" />
							Links
						</li>
					</a>
					<a href="/qrcode" className="w-full">
						<li
							className={`${isQrCode ? 'bg-mariner-100' : 'text-mariner-950'} rounded-md w-full flex items-center px-4 h-10 font-bold text-sm gap-2 hover:bg-mariner-50 hover:text-mariner-400`}
						>
							<QrCodeIcon className="w-5 h-5" />
							QR Codes
						</li>
					</a>
				</ul>
			</div>
		</aside>
	)
}
