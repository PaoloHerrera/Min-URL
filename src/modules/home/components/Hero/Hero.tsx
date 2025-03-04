import type React from 'react'
import { FormComponent } from './FormComponent.tsx'
import { HeroHeader } from './HeroHeader.tsx'
import { useTranslation } from '@/modules/core/hooks/useTranslation.ts'
import { CodeCard } from '@/modules/core/design-system/CodeCard.tsx'
import { Chip } from '@/modules/core/design-system/Chip.tsx'
import { useShortUrl } from '@/modules/home/hooks/useShortUrl.ts'
import { ShortUrlCard } from './ShortUrlCard.tsx'
import { ButtonContent } from './ButtonContent.tsx'

export const Hero = () => {
	const { t } = useTranslation()
	const { header, formLabels, buttons, common, code } = t('hero')
	const { state, handleUrlChange, shortenUrl } = useShortUrl()

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		await shortenUrl()
	}

	return (
		<section
			id="hero"
			className="w-full flex flex-col lg:px-32 px-4 md:py-16 py-10 bg-gradient-to-b from-mariner-50 to-mariner-400 gap-10"
		>
			<div className="flex gap-20 justify-between xl:flex-row flex-col">
				<article className="flex flex-col gap-10 w-full">
					<Chip>{header.chipTitle}</Chip>
					<HeroHeader title={header.title} subtitle={header.subtitle} />

					<FormComponent
						onSubmit={handleSubmit}
						error={state.error.type !== ''}
						onChangeUrl={(e) => handleUrlChange(e.target.value)}
						isLoading={state.isLoading}
						errorMessage={state.error.message}
						ariaLabel={formLabels.shorturl}
					>
						<ButtonContent
							isLoading={state.isLoading}
							activeMode={'shorturl'}
							buttons={buttons}
							generating={common.generating}
						/>
					</FormComponent>
					{state.shortUrl && (
						<ShortUrlCard
							shortUrl={state.shortUrl}
							createdAt={state.createdAt}
						/>
					)}
				</article>

				<article className="text-mariner-50 rounded-2xl border border-mariner-200 bg-mariner-700 overflow-y-auto max-h-[600px] w-full hidden sm:block">
					<CodeCard>{code}</CodeCard>
				</article>
			</div>
		</section>
	)
}
