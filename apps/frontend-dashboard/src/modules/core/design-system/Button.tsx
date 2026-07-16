import type React from 'react'
type ButtonVariant = 'primary' | 'secondary' | 'selected'

export type ButtonProps = {
	children: React.ReactNode
	variant?: ButtonVariant
	type?: 'button' | 'submit' | 'reset'
	onClick?: () => void
	disabled?: boolean
	isSelected?: boolean
}

// Se definen las clases dependiendo de la variante del botón
const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
	primary: 'bg-mariner-700 text-white hover:opacity-90',
	secondary: 'bg-transparent text-mariner-700 hover:opacity-90',
	selected: 'text-mariner-950',
}

// Se definen las clases comunes
const BUTTON_BASE_CLASSES =
	'rounded-lg font-bold flex items-center gap-2 transition-all duration-300 ease-in-out w-fit md:text-sm text-sm'

// Se definen las clases de tamaño dependiendo de la variante del botón
const SIZE_CLASSES: Record<ButtonVariant, string> = {
	primary: 'px-6 py-4 flex items-center space-x-2',
	secondary: 'px-4 py-2 flex items-center space-x-2',
	selected: 'p-2',
}

// Se definen las clases de estado
const STATE_CLASSES = {
	disabled: 'opacity-75 pointer-events-none',
	enabled: 'cursor-pointer',
}

// Se definen las clases de estado y variante
const SELECTED_CLASSES = {
	selected: 'bg-white',
	unselected: 'bg-transparent hover:bg-mariner-100',
}

export const Button = ({
	children,
	variant = 'primary',
	type = 'button',
	onClick,
	disabled = false,
	isSelected = false,
}: ButtonProps) => {
	const isVariantSelected = variant === 'selected'
	const stateClass = STATE_CLASSES[disabled ? 'disabled' : 'enabled']

	const stateClassSelected = isVariantSelected
		? SELECTED_CLASSES[isSelected ? 'selected' : 'unselected']
		: ''

	return (
		<button
			type={type}
			className={`${BUTTON_BASE_CLASSES} ${BUTTON_VARIANTS[variant]} ${SIZE_CLASSES[variant]} ${stateClass} ${stateClassSelected}`}
			onClick={onClick}
			disabled={disabled}
			aria-disabled={disabled}
			aria-pressed={isSelected}
		>
			{children}
		</button>
	)
}
