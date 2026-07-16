import { Input } from '@/modules/core/design-system/Input'
import { SearchIcon, XIcon } from 'lucide-react'
import { useState } from 'react'

export const SearchInput = ({ placeholder }: { placeholder: string }) => {
	const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

	return (
		<div className="flex items-center gap-2 md:gap-4">
			<button
				type="button"
				className="rounded-full xl:hidden w-10 h-10 cursor-pointer flex items-center justify-center hover:bg-mariner-100"
				onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
			>
				{mobileSearchOpen ? <XIcon size={20} /> : <SearchIcon size={20} />}
			</button>

			<div className="relative items-center bg-mariner-50 gap-2 hidden xl:flex">
				<span className="px-4 absolute top-0 left-0 h-full opacity-60 flex items-center">
					<SearchIcon className="w-5 h-5" />
				</span>
				<Input
					id="search"
					type="text"
					placeholder={placeholder}
					className="px-14"
				/>
			</div>
		</div>
	)
}
