import { useForm } from 'react-hook-form'
import { CustomSlugInput } from './CustomSlugInput.tsx'
import { Checkbox } from '@/modules/core/ui/checkbox'
import { InputForm } from './InputForm.tsx'
import { Spinner } from '@/modules/core/design-system/Spinner'
import { useTranslations } from '@/modules/core/hooks/useTranslations.ts'
import { useCreateShortUrl } from '@/modules/createNew/hooks/useCreateShortUrl'
import { XCircleIcon } from 'lucide-react'

const URL_REGEX = /^https?:\/\/.+/
const SLUG_REGEX = /^[a-zA-Z0-9-_]+$/

interface FormData {
	title: string
	url: string
	customSlug: boolean
	slug?: string
}

interface CreateLinkFormProps {
	onClose: () => Promise<void>
}

export const CreateLinkForm = ({ onClose }: CreateLinkFormProps) => {
	const { dashboard } = useTranslations()
	const { dialogNewLink } = dashboard.navbar
	const { handleSubmit: submitShortUrl, serverError } = useCreateShortUrl()
	const {
		register,
		handleSubmit,
		watch,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm<FormData>({
		defaultValues: {
			title: '',
			url: '',
			customSlug: false,
			slug: '',
		},
		mode: 'onChange',
	})

	const customSlug = watch('customSlug')
	const slug = watch('slug')

	const onSubmit = async (data: FormData) => {
		await submitShortUrl(data, onClose)
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
			<div className="grid gap-10 py-4">
				<InputForm
					inputText={dialogNewLink.urlTitle}
					error={errors.title?.message}
					disabled={isSubmitting}
					{...register('title', {
						required: dialogNewLink.urlTitle.error.minLength,
						minLength: {
							value: 1,
							message: dialogNewLink.urlTitle.error.minLength,
						},
						maxLength: {
							value: 100,
							message: dialogNewLink.urlTitle.error.maxLength,
						},
					})}
				/>
				<InputForm
					inputText={dialogNewLink.originalUrl}
					error={errors.url?.message}
					disabled={isSubmitting}
					{...register('url', {
						required: dialogNewLink.originalUrl.error.minLength,
						pattern: {
							value: URL_REGEX,
							message: dialogNewLink.originalUrl.error.invalid,
						},
					})}
				/>
				<div className="grid gap-5 grid-cols-2 w-full items-center">
					<label
						htmlFor="questionSlug"
						className="text-mariner-600 font-semibold text-sm"
					>
						{dialogNewLink.questionSlug.label}
					</label>
					<Checkbox
						id="questionSlug"
						onCheckedChange={(checked) =>
							setValue('customSlug', checked as boolean)
						}
					/>
				</div>

				{customSlug && (
					<CustomSlugInput
						{...register('slug', {
							pattern: {
								value: SLUG_REGEX,
								message: dialogNewLink.customSlug.error.invalid,
							},
							required: dialogNewLink.customSlug.error.minLength,
							minLength: {
								value: 6,
								message: dialogNewLink.customSlug.error.minLength,
							},
							maxLength: {
								value: 12,
								message: dialogNewLink.customSlug.error.maxLength,
							},
						})}
						error={errors.slug?.message}
						value={slug || ''}
					/>
				)}
			</div>
			{serverError && (
				<div className="flex items-center gap-2 mb-5 rounded-md p-4 shadow-sm">
					<XCircleIcon className="text-error text-sm" />
					<span className="text-error text-sm font-semibold">
						{serverError}
					</span>
				</div>
			)}
			<div className="flex flex-row justify-end gap-5">
				<button
					type="button"
					className="text-mariner-950 bg-transparent rounded-lg flex items-center cursor-pointer hover:bg-mariner-50 text-sm py-2 px-3 border border-mariner-200"
					onClick={async () => await onClose()}
					disabled={isSubmitting}
				>
					{dialogNewLink.cancelText}
				</button>
				<button
					type="submit"
					className="text-white bg-mariner-600 rounded-lg flex items-center cursor-pointer hover:opacity-90 text-sm py-2 px-3"
					disabled={isSubmitting}
				>
					{isSubmitting ? (
						<div className="flex items-center gap-2">
							<Spinner className="text-mariner-100 text-sm" />
							<span>{dialogNewLink.loadingSubmitText}</span>
						</div>
					) : (
						dialogNewLink.submitText
					)}
				</button>
			</div>
		</form>
	)
}
