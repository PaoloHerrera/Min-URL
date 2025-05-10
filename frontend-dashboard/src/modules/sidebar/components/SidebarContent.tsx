import { useLocation } from 'react-router'
import { HomeIcon, LinkIcon, QrCodeIcon, HelpCircleIcon } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore.ts'
import { Usage } from './Usage.tsx'
import { useTranslations } from '@/modules/core/hooks/useTranslations.ts'

export const SidebarContent = () => {
	// Get params from URL
	const location = useLocation()

	const { user } = useAuthStore()

	const { dashboard } = useTranslations()
	const { usage, footer } = dashboard.sidebar

	const currentPath = location.pathname

	const isDashboard = currentPath === '/'
	const isLink = currentPath === '/links'
	const isQrCode = currentPath === '/qrcodes'

	return (
		<div className="flex flex-col w-full h-full justify-between gap-5">
			<div className="flex flex-col gap-10 h-full py-4 px-8">
				<ul className="flex flex-col text-mariner-500 w-full gap-3">
					<a href="/" className="w-full">
						<li
							className={`${isDashboard ? 'bg-mariner-100 text-mariner-500' : 'text-mariner-950'}  rounded-md w-full flex items-center px-2 h-10 font-bold text-sm gap-2 hover:bg-mariner-50 hover:text-mariner-400`}
						>
							<HomeIcon className="w-5 h-5" />
							Dashboard
						</li>
					</a>
					<a href="/links" className="w-full">
						<li
							className={`${isLink ? 'bg-mariner-100' : 'text-mariner-950'} rounded-md w-full flex items-center px-2 h-10 font-bold text-sm gap-2 hover:bg-mariner-50 hover:text-mariner-400`}
						>
							<LinkIcon className="w-5 h-5" />
							Links
						</li>
					</a>
					<a href="/qrcodes" className="w-full">
						<li
							className={`${isQrCode ? 'bg-mariner-100' : 'text-mariner-950'} rounded-md w-full flex items-center px-2 h-10 font-bold text-sm gap-2 hover:bg-mariner-50 hover:text-mariner-400`}
						>
							<QrCodeIcon className="w-5 h-5" />
							QR Codes
						</li>
					</a>
				</ul>
			</div>
			<div className="flex flex-col gap-10 py-8 px-8 border-t border-b">
				{user && (
					<div className="flex flex-col items-center justify-center gap-10 w-full">
						<Usage
							title={usage.link}
							icon={LinkIcon}
							used={user.shortUrlUsage}
							remaining={user.shortUrlAvailable}
							max={50}
						/>
						<Usage
							title={usage.qrcode}
							icon={QrCodeIcon}
							used={user.qrCodeUsage}
							remaining={user.qrCodeAvailable}
							max={25}
						/>
					</div>
				)}
			</div>
			<div className="flex flex-col gap-10 py-4 px-8 mb-5">
				<ul className="flex flex-col text-mariner-950 w-full">
					<a href="https://github.com/PaoloHerrera/min-url" className="w-full">
						<li className="rounded-md w-full flex items-center px-2 h-10 font-bold text-sm gap-2 hover:bg-mariner-50 hover:text-mariner-400">
							<HelpCircleIcon className="w-5 h-5" />
							{footer.support}
						</li>
					</a>
				</ul>
			</div>
		</div>
	)
}
