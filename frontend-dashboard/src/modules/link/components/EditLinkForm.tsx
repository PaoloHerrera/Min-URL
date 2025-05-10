import { useForm } from 'react-hook-form'
import { InputForm } from '@/modules/createNew/components/InputForm'
import { useTranslations } from '@/modules/core/hooks/useTranslations'
import { MessageCircleWarningIcon, XCircleIcon } from 'lucide-react'
import { useUpdateUrl } from '@/modules/link/hooks/useUpdateUrl'

const urlRegex = /^https?:\/\/.+/

interface FormData {
	title: string
	url: string
}

interface EditLinkFormProps extends FormData {
	id: string
	clicks: number
	onClose: () => void
}

export const EditLinkForm = ({
	id,
	title,
	url,
	clicks,
	onClose,
}: EditLinkFormProps) => {
	const {
		handleSubmit,
		register,
		formState: { errors, isSubmitting },
	} = useForm<FormData>({
		defaultValues: {
			title,
			url,
		},
		mode: 'onChange',
	})
	const { link } = useTranslations()
	const { editDialog } = link

	const { updateUrlState, updateUrlMutation } = useUpdateUrl()

	const onSubmit = async (data: FormData) => {
		await updateUrlMutation({ id, title: data.title, url: data.url })
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div className="grid gap-5">
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
					{clicks > 0 && (
						<div className="bg-amber-100 p-2 rounded-md flex gap-2 border border-amber-400 shadow-sm">
							<MessageCircleWarningIcon className="text-amber-400" size={20} />
							<p className="text-mariner-950 text-xs font-medium">
								{editDialog.originalUrl.cannotBeChanged?.prefix}
								{clicks}
								{editDialog.originalUrl.cannotBeChanged?.suffix}
							</p>
						</div>
					)}
				</div>
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
