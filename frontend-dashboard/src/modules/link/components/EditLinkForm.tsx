import { useTranslations } from '@/modules/core/hooks/useTranslations'
import { CustomSlugInput } from '@/modules/createNew/components/CustomSlugInput'
import { InputForm } from '@/modules/createNew/components/InputForm'
import { useUpdateUrl } from '@/modules/link/hooks/useUpdateUrl'
import { MessageCircleWarningIcon, XCircleIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'

const urlRegex = /^https?:\/\/.+/
const SLUG_REGEX = /^[a-zA-Z0-9-_]+$/

interface FormData {
	title: string
	url: string
	slug?: string
}

interface EditLinkFormProps extends FormData {
	id: string
	originalSlug: string
	clicks: number
	onClose: () => void
}

export const EditLinkForm = ({
	id,
	title,
	url,
	originalSlug,
	clicks,
	onClose,
}: EditLinkFormProps) => {
	const {
		handleSubmit,
		watch,
		register,
		formState: { errors, isSubmitting },
	} = useForm<FormData>({
		defaultValues: {
			title,
			url,
			slug: originalSlug,
		},
		mode: 'onChange',
	})
	const { link } = useTranslations()
	const { editDialog } = link

	const { updateUrlState, updateUrlMutation } = useUpdateUrl()

	const slug = watch('slug')

	const onSubmit = async (data: FormData) => {
		const response = await updateUrlMutation({
			id,
			title: data.title,
			url: data.url,
			slug: data.slug,
		})

		console.log('Response from updateUrlMutation:', response.message)
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div className="grid gap-8 py-4">
				<InputForm
					inputText={editDialog.urlTitle}
					error={errors.title?.message}
					{...register('title', {
						required: 'Title is required',
						minLength: {
							value: 1,
							message: 'Minimum length is 1',
						},
						maxLength: {
							value: 100,
							message: 'Maximum length is 100',
						},
					})}
					disabled={isSubmitting}
				/>
				<div className="flex flex-col gap-2">
					<InputForm
						inputText={editDialog.originalUrl}
						error={errors.url?.message}
						disabled={clicks > 0 || isSubmitting}
						{...register('url', {
							required: 'URL is required',
							pattern: {
								value: urlRegex,
								message: 'Invalid URL',
							},
						})}
					/>
				</div>
				<div className="flex flex-col gap-2">
					<CustomSlugInput
						disabled={clicks > 0 || isSubmitting}
						{...register('slug', {
							pattern: {
								value: SLUG_REGEX,
								message: editDialog.customSlug.error.invalid,
							},
							required: editDialog.customSlug.error.minLength,
							minLength: {
								value: 6,
								message: editDialog.customSlug.error.minLength,
							},
							maxLength: {
								value: 12,
								message: editDialog.customSlug.error.maxLength,
							},
						})}
						error={errors.slug?.message}
						value={slug || ''}
						originalSlug={originalSlug}
					/>
				</div>
				{clicks > 0 && (
					<div className="bg-amber-100 p-2 rounded-md flex gap-2 border border-amber-400 shadow-sm">
						<MessageCircleWarningIcon className="text-amber-400" size={20} />
						<p className="text-mariner-950 text-xs font-medium">
							{editDialog.cannotBeChanged}
						</p>
					</div>
				)}
			</div>
			{updateUrlState.error && (
				<div className="flex items-center gap-2 mb-5 rounded-md p-4 shadow-sm mt-5">
					<XCircleIcon className="text-red-500 text-sm" size={20} />
					<span className="text-error text-sm font-semibold">
						{updateUrlState.error}
					</span>
				</div>
			)}
			<div className="flex flex-row justify-end gap-5 mt-5">
				<button
					type="button"
					className="text-mariner-950 bg-transparent rounded-lg flex items-center cursor-pointer hover:bg-mariner-50 text-sm py-2 px-3 border border-mariner-200"
					disabled={isSubmitting}
					onClick={onClose}
				>
					{editDialog.cancelLabel}
				</button>
				<button
					type="submit"
					className="text-white bg-mariner-600 rounded-lg flex items-center cursor-pointer hover:opacity-90 text-sm py-2 px-3"
					disabled={isSubmitting}
				>
					{editDialog.submitLabel}
				</button>
			</div>
		</form>
	)
}
