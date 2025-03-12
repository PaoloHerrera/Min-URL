import { Input } from '@/modules/core/design-system/Input'
import { SearchIcon } from 'lucide-react'

export const SearchInput = () => {
	return (
		<div className="w-96 relative flex items-center bg-mariner-50 gap-2">
			<span className="px-4 absolute top-0 left-0 h-full opacity-60 flex items-center">
				<SearchIcon className="w-5 h-5" />
			</span>
			<Input
				id="search"
				type="text"
				placeholder="Search links"
				className="px-14"
			/>
		</div>
	)
}
