import { MinUrlIcon, GithubIcon } from '@/modules/core/design-system/Icons.tsx'
import { LanguagesIcon, LogInIcon } from 'lucide-react'
import { useTranslation } from '@/modules/core/hooks/useTranslation.ts'
import type { Language } from '@/modules/core/utils/types.d.ts'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/modules/core/ui/select.tsx'

const supportedLanguages = {
	en: 'English',
	es: 'Español',
}

export const Navbar = () => {
	const { lang, setLang } = useTranslation()
	const handleLanguageClick = (language: Language) => {
		setLang(language)
	}

	return (
		<header className="fixed top-0 left-0 w-full z-50 flex items-center justify-center bg-mariner-50 px-4 lg:px-32">
			<nav className="py-4 w-full flex items-center justify-between md:gap-20">
				<div className="md:text-2xl text-lg font-bold text-mariner-500">
					<a href="/" className="flex items-center gap-2">
						<MinUrlIcon />
						Min-URL
					</a>
				</div>
				<div className="flex gap-2 md:gap-10 items-center">
					<Select
						value={lang}
						onValueChange={(e) => handleLanguageClick(e as Language)}
					>
						<SelectTrigger className="bg-transparent text-mariner-500 gap-2">
							<LanguagesIcon className="w-4 h-4 hidden sm:block" />
							<SelectValue>
								<span className="font-semibold text-sm">
									{lang.toUpperCase()}
								</span>
							</SelectValue>
						</SelectTrigger>
						<SelectContent>
							{Object.keys(supportedLanguages).map((language) => (
								<SelectItem key={language} value={language}>
									<div className="text-xs font-semibold flex gap-2 items-center">
										{language.toLocaleUpperCase()}
										<span className="text-sm font-normal">
											{supportedLanguages[language as Language]}
										</span>
									</div>
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<a
						href="/"
						className="text-mariner-500 rounded-full bg-transparent px-2 py-2 hover:bg-mariner-500 hover:text-white"
					>
						<GithubIcon className="w-8 h-8" />
					</a>

					<div className="w-full">
						<a
							href="/login"
							className="sm:w-[100px] rounded-md text-white bg-mariner-700 px-2 py-2 flex items-center gap-2 hover:bg-mariner-500"
						>
							<LogInIcon className="w-4 h-4" />
							<span className="text-sm font-semibold hidden sm:block">
								Sign in
							</span>
						</a>
					</div>
				</div>
			</nav>
		</header>
	)
}
