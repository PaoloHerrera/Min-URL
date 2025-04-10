import { InputForm } from './InputForm.tsx'
import { useTranslations } from '@/modules/core/hooks/useTranslations.ts'
import { useForm } from 'react-hook-form'
import { QrPreview } from './QrPreview.tsx'
import { Spinner } from '@/modules/core/design-system/Spinner.tsx'
import { useCreateQrCode } from '@/modules/createNew/hooks/useCreateQrCode'
import { XCircleIcon } from 'lucide-react'

const URL_REGEX = /^https?:\/\/.+/
const COLOR_REGEX = /^#([A-Fa-f0-9]{6})$/

interface CreateQrFormProps {
	onClose: () => Promise<void>
}

interface FormData {
	title: string
	url: string
	foregroundColor: string
	backgroundColor: string
}

export const CreateQrCodeForm = ({ onClose }: CreateQrFormProps) => {
	const { dashboard } = useTranslations()
	const { dialogNewQr } = dashboard.navbar
	const { handleSubmit: submitQrCode, serverError } = useCreateQrCode()

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
			foregroundColor: '#000000',
			backgroundColor: '#ffffff',
		},
		mode: 'onChange',
	})

	const foregroundColor = watch('foregroundColor')
	const backgroundColor = watch('backgroundColor')

	const onSubmit = async (data: FormData) => {
		await submitQrCode(data, onClose)
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
			<div className="grid gap-10 py-4">
				<InputForm
					inputText={dialogNewQr.qrCodeTitle}
					error={errors.title?.message}
					disabled={isSubmitting}
					{...register('title', {
						required: dialogNewQr.qrCodeTitle.error.minLength,
						minLength: {
							value: 1,
							message: dialogNewQr.qrCodeTitle.error.minLength,
						},
						maxLength: {
							value: 100,
							message: dialogNewQr.qrCodeTitle.error.maxLength,
						},
					})}
				/>
				<InputForm
					inputText={dialogNewQr.originalUrl}
					error={errors.url?.message}
					disabled={isSubmitting}
					{...register('url', {
						required: dialogNewQr.originalUrl.error.minLength,
						pattern: {
							value: URL_REGEX,
							message: dialogNewQr.originalUrl.error.invalid,
						},
					})}
				/>
				<div className="grid gap-2 w-full items-center justify-center py-4 bg-mariner-50 justify-items-center">
					<span className="text-center text-sm font-semibold text-mariner-950 opacity-70">
						{dialogNewQr.preview}
					</span>
					<QrPreview
						foregroundColor={foregroundColor}
						backgroundColor={backgroundColor}
					/>
					<span className="text-center text-xs font-semibold text-mariner-950 opacity-70">
						{dialogNewQr.previewDescription}
					</span>
				</div>
			</div>

			{/* Foreground Color And Background Color */}
			<div className="grid gap-5 grid-cols-2 w-full items-center">
				<label
					htmlFor="foregroundColor"
					className="text-mariner-600 font-semibold text-sm"
				>
					{dialogNewQr.foregroundColor}
				</label>
				<label
					htmlFor="backgroundColor"
					className="text-mariner-600 font-semibold text-sm"
				>
					{dialogNewQr.backgroundColor}
				</label>
			</div>
			<div className="flex flex-row w-full items-center gap-5">
				<div className="flex-1 flex flex-row gap-2">
					<input
						id="foregroundColor"
						type="color"
						className="rounded-lg border border-mariner-950 bg-transparent w-16 h-10 p-1"
						{...register('foregroundColor')}
						onChange={(e) => setValue('foregroundColor', e.target.value)}
					/>
					<input
						type="text"
						className="w-full h-10 rounded-lg bg-mariner-50 border shadow-md focus:outline-none px-2"
						{...register('foregroundColor', {
							pattern: {
								value: COLOR_REGEX,
								message: 'Invalid color',
							},
						})}
						onChange={(e) => {
							const value = e.target.value

							if (COLOR_REGEX.test(value)) {
								setValue(
									'foregroundColor',
									value.startsWith('#') ? value : `#${value}`,
									{ shouldValidate: true },
								)
							}
						}}
					/>
				</div>
				<div className="flex-1 flex flex-row gap-2">
					<input
						id="backgroundColor"
						type="color"
						className="rounded-lg border border-mariner-950 bg-transparent w-16 h-10 p-1"
						{...register('backgroundColor')}
						onChange={(e) => setValue('backgroundColor', e.target.value)}
					/>
					<input
						type="text"
						className="w-full h-10 rounded-lg bg-mariner-50 border shadow-md focus:outline-none px-2"
						{...register('backgroundColor', {
							pattern: {
								value: COLOR_REGEX,
								message: 'Invalid color',
							},
						})}
						onChange={(e) => {
							const value = e.target.value

							if (COLOR_REGEX.test(value)) {
								setValue(
									'backgroundColor',
									value.startsWith('#') ? value : `#${value}`,
									{ shouldValidate: true },
								)
							}
						}}
					/>
				</div>
			</div>
			<div className="flex flex-row justify-between gap-5">
				<span className="text-xs text-error flex-1 text-center">
					{errors.foregroundColor?.message}
				</span>
				<span className="text-xs text-error flex-1 text-center">
					{errors.backgroundColor?.message}
				</span>
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
					{dialogNewQr.cancelText}
				</button>
				<button
					type="submit"
					className="text-white bg-mariner-600 rounded-lg flex items-center cursor-pointer hover:opacity-90 text-sm py-2 px-3"
					disabled={isSubmitting}
				>
					{isSubmitting ? (
						<div className="flex items-center gap-2">
							<Spinner className="text-mariner-100 text-sm" />
							<span>{dialogNewQr.loadingSubmitText}</span>
						</div>
					) : (
						dialogNewQr.submitText
					)}
				</button>
			</div>
		</form>
	)
}
