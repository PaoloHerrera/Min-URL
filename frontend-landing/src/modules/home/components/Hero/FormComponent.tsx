import type React from 'react'
import { Button } from '@/modules/core/design-system/Button'
import { Input } from '@/modules/core/design-system/Input.tsx'

type FormComponentProps = {
	onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
	children: React.ReactNode
	error: boolean
	onChangeUrl: (e: React.ChangeEvent<HTMLInputElement>) => void
	isLoading: boolean
	ariaLabel?: string
	errorMessage?: string
}

export const FormComponent = ({
	onSubmit,
	children,
	ariaLabel = 'URL',
	error,
	onChangeUrl,
	isLoading,
	errorMessage,
}: FormComponentProps) => {
	return (
		<>
			<form className="relative w-full mx-auto h-full" onSubmit={onSubmit}>
				<label
					className="font-medium text-mariner-600 opacity-80"
					htmlFor="url"
				>
					{ariaLabel}
				</label>
				<div className="flex flex-col gap-4 md:flex-row">
					<Input
						id="url"
						placeholder="https://example.com/long-url-example"
						onChange={onChangeUrl}
						error={error}
						disabled={isLoading}
					/>
					{error && (
						<p className="text-error block md:hidden">{errorMessage}</p>
					)}
					<Button type="submit" variant="primary" disabled={isLoading}>
						{children}
					</Button>
				</div>
				{error && (
					<p className="text-error mt-2 hidden md:block">{errorMessage}</p>
				)}
			</form>
		</>
	)
}
