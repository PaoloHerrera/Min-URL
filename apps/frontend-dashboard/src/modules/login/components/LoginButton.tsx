import type { LoginButtonProps } from '@/types'

export const LoginButton = ({ icon: Icon, text, link }: LoginButtonProps) => {
	return (
		<a
			href={link}
			className="flex items-center justify-center gap-2 rounded-md bg-mariner-50 p-3 text-mariner-500 hover:bg-mariner-500 hover:text-mariner-50 transition-all duration-300 shadow-sm"
		>
			<Icon className="w-6 h-6" />
			<p>{text}</p>
		</a>
	)
}
