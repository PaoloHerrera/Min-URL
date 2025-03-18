import type React from 'react'
type Input = {
	id: string
	type?: 'text' | 'email' | 'password'
	placeholder: string
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
	error?: boolean
	disabled?: boolean
	className?: string
}

export const Input = ({
	id,
	placeholder,
	onChange,
	type = 'text',
	error,
	disabled,
	className,
}: Input) => {
	return (
		<>
			<input
				id={id}
				type={type}
				placeholder={placeholder}
				onChange={onChange}
				className={`w-full p-2 bg-mariner-50 border-mariner-200 focus:outline-none rounded-md shadow-sm text-mariner-950 placeholder-mariner-950 placeholder:opacity-50 ${className}`}
				style={error ? { border: '2px solid var(--color-error)' } : {}}
				disabled={disabled}
			/>
		</>
	)
}
