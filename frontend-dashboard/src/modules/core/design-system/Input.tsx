import type React from 'react'
type Input = {
	id: string

	type?: 'text' | 'email' | 'password'
	placeholder: string
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
	error?: boolean
	disabled?: boolean
}

export const Input = ({
	id,
	placeholder,
	onChange,
	type = 'text',
	error,
	disabled,
}: Input) => {
	return (
		<>
			<input
				id={id}
				type={type}
				placeholder={placeholder}
				onChange={onChange}
				className="w-full px-6 py-4 bg-mariner-200 border-mariner-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-mariner-500 focus:border-transparent text-mariner-950 placeholder-mariner-950 placeholder:opacity-50"
				style={error ? { borderColor: 'var(--color-error)' } : {}}
				disabled={disabled}
			/>
		</>
	)
}
