import type React from 'react'
type InputProps = {
	id?: string
	name?: string
	type: React.InputHTMLAttributes<HTMLInputElement>['type']
	placeholder?: string
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
	onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
	ref?: React.Ref<HTMLInputElement>
	error?: boolean
	disabled?: boolean
	className?: string
	value?: string
}

export const Input = ({
	id,
	name,
	placeholder,
	onChange,
	onBlur,
	ref,
	type = 'text',
	error,
	disabled,
	className,
	value,
}: InputProps) => {
	return (
		<>
			<input
				id={id}
				name={name}
				type={type}
				placeholder={placeholder}
				onChange={onChange}
				onBlur={onBlur}
				ref={ref}
				className={`w-full p-2 bg-mariner-50 border-mariner-200 focus:outline-none rounded-md shadow-sm text-mariner-950 placeholder-mariner-950 placeholder:opacity-50 ${className}`}
				style={error ? { border: '2px solid var(--color-error)' } : {}}
				disabled={disabled}
				value={value}
			/>
		</>
	)
}
