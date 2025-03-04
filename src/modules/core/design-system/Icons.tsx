import type { Colors } from '@/modules/core/utils/types'
import { ColorsWebsite } from '@/modules/core/utils/constants'

export const MinUrlIcon = () => {
	return (
		<svg
			fill="none"
			viewBox="0 0 100 100"
			strokeWidth={1.5}
			stroke="#1971CE"
			className="w-6 h-6"
		>
			<title>Min-URL</title>
			<path
				fill="#1971CE"
				d="M25.898 92.38a2.869 2.869 0 0 1-.607-4.52l62.576-62.576a2.869 2.869 0 0 1 4.52.607c4.153 7.287 6.368 15.54 6.368 24.102 0 26.924-21.824 48.749-48.748 48.749-8.577.006-16.83-2.208-24.109-6.362zM50 93.015c23.757 0 43.015-19.258 43.015-43.015a42.85 42.85 0 0 0-3.878-17.878L32.122 89.137A42.85 42.85 0 0 0 50 93.015zM7.62 74.102C3.466 66.815 1.252 58.562 1.252 50 1.252 23.076 23.076 1.252 50 1.252c8.57 0 16.822 2.214 24.102 6.368a2.869 2.869 0 0 1 .607 4.52l-62.57 62.576c-1.338 1.332-3.587 1.035-4.519-.614zm60.258-63.239A42.85 42.85 0 0 0 50 6.985C26.243 6.985 6.985 26.243 6.985 50a42.85 42.85 0 0 0 3.878 17.878l57.015-57.015z"
			/>
		</svg>
	)
}

export const LinkIcon = () => {
	return (
		<svg
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth={1.5}
			stroke="currentColor"
			className="w-10 h-10"
		>
			<title>Link</title>
			<path
				d="M9.16488 17.6505C8.92513 17.8743 8.73958 18.0241 8.54996 18.1336C7.62175 18.6695 6.47816 18.6695 5.54996 18.1336C5.20791 17.9361 4.87912 17.6073 4.22153 16.9498C3.56394 16.2922 3.23514 15.9634 3.03767 15.6213C2.50177 14.6931 2.50177 13.5495 3.03767 12.6213C3.23514 12.2793 3.56394 11.9505 4.22153 11.2929L7.04996 8.46448C7.70755 7.80689 8.03634 7.47809 8.37838 7.28062C9.30659 6.74472 10.4502 6.74472 11.3784 7.28061C11.7204 7.47809 12.0492 7.80689 12.7068 8.46448C13.3644 9.12207 13.6932 9.45086 13.8907 9.7929C14.4266 10.7211 14.4266 11.8647 13.8907 12.7929C13.7812 12.9825 13.6314 13.1681 13.4075 13.4078M10.5919 10.5922C10.368 10.8319 10.2182 11.0175 10.1087 11.2071C9.57284 12.1353 9.57284 13.2789 10.1087 14.2071C10.3062 14.5492 10.635 14.878 11.2926 15.5355C11.9502 16.1931 12.279 16.5219 12.621 16.7194C13.5492 17.2553 14.6928 17.2553 15.621 16.7194C15.9631 16.5219 16.2919 16.1931 16.9495 15.5355L19.7779 12.7071C20.4355 12.0495 20.7643 11.7207 20.9617 11.3787C21.4976 10.4505 21.4976 9.30689 20.9617 8.37869C20.7643 8.03665 20.4355 7.70785 19.7779 7.05026C19.1203 6.39267 18.7915 6.06388 18.4495 5.8664C17.5212 5.3305 16.3777 5.3305 15.4495 5.8664C15.2598 5.97588 15.0743 6.12571 14.8345 6.34955"
				strokeLinecap="round"
			/>
		</svg>
	)
}

export const QrCodeIcon = () => {
	return (
		<svg
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth={1}
			stroke="currentColor"
			className="w-10 h-10"
		>
			<title>QR Code</title>
			<path d="M5,15v2H3V15ZM3,21H5V19H3Zm2-4v2H7V17Zm4-6H7v2H5v2H9ZM3,11v2H5V11Zm6,8H7v2h5V19H11V17H9ZM13,4H11V6h2Zm-2,7h2V8H11ZM4,9A1,1,0,0,1,3,8V4A1,1,0,0,1,4,3H8A1,1,0,0,1,9,4V8A1,1,0,0,1,8,9ZM5,7H7V5H5ZM21,4v8H19V9H16a1,1,0,0,1-1-1V4a1,1,0,0,1,1-1h4A1,1,0,0,1,21,4ZM19,5H17V7h2Zm2,11v4a1,1,0,0,1-1,1H16a1,1,0,0,1-1-1V17H11V13h2v2h1V11h2v4h4A1,1,0,0,1,21,16Zm-2,1H17v2h2Z" />
		</svg>
	)
}

export const FastIcon = ({
	fillColor,
	backgroundColor,
	borderColor,
}: { fillColor: Colors; backgroundColor: Colors; borderColor: Colors }) => {
	return (
		<span
			className="border-2 rounded-full p-3"
			style={{
				backgroundColor: ColorsWebsite[backgroundColor],
				borderColor: ColorsWebsite[borderColor],
			}}
		>
			<svg
				viewBox="0 0 24 24"
				strokeWidth={1}
				stroke={ColorsWebsite[fillColor]}
				fill={ColorsWebsite[fillColor]}
				className="w-6 h-6"
			>
				<title>Fast</title>
				<path d="M5.66493 2.74199C5.99503 1.70455 6.95855 1 8.04724 1H13.1756C14.9704 1 16.1805 2.83513 15.4735 4.4848L13.967 8H18.2405C20.4882 8 21.5942 10.7352 19.978 12.2975L9.43055 22.4934C8.25327 23.6314 6.36431 22.329 7.0093 20.824L9.93388 14H5.50179C3.80978 14 2.60645 12.3544 3.11948 10.742L5.66493 2.74199ZM8.04724 3C7.82951 3 7.6368 3.14091 7.57078 3.3484L5.02533 11.3484C4.92272 11.6709 5.16339 12 5.50179 12H11.1471C12.0086 12 12.5894 12.8809 12.2501 13.6727L9.82561 19.3298L18.588 10.8595C18.9112 10.547 18.69 10 18.2405 10H12.7537C11.8922 10 11.3114 9.11914 11.6508 8.3273L13.6352 3.69696C13.7766 3.36703 13.5346 3 13.1756 3H8.04724Z" />
			</svg>
		</span>
	)
}

export const SecureIcon = ({
	fillColor,
	backgroundColor,
	borderColor,
}: { fillColor: Colors; backgroundColor: Colors; borderColor: Colors }) => {
	return (
		<span
			className="border-2 rounded-full p-3"
			style={{
				backgroundColor: ColorsWebsite[backgroundColor],
				borderColor: ColorsWebsite[borderColor],
			}}
		>
			<svg
				viewBox="0 0 24 24"
				strokeWidth={1}
				stroke={ColorsWebsite[fillColor]}
				fill={ColorsWebsite[fillColor]}
				className="w-6 h-6"
			>
				<title>Secure</title>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M12.4472 1.10557C12.1657 0.964809 11.8343 0.964809 11.5528 1.10557L3.55279 5.10557C3.214 5.27496 3 5.62123 3 6V12C3 14.6622 3.86054 16.8913 5.40294 18.7161C6.92926 20.5218 9.08471 21.8878 11.6214 22.9255C11.864 23.0248 12.136 23.0248 12.3786 22.9255C14.9153 21.8878 17.0707 20.5218 18.5971 18.7161C20.1395 16.8913 21 14.6622 21 12V6C21 5.62123 20.786 5.27496 20.4472 5.10557L12.4472 1.10557ZM5 12V6.61803L12 3.11803L19 6.61803V12C19 14.1925 18.305 15.9635 17.0696 17.425C15.8861 18.8252 14.1721 19.9803 12 20.9156C9.82786 19.9803 8.11391 18.8252 6.93039 17.425C5.69502 15.9635 5 14.1925 5 12ZM16.7572 9.65323C17.1179 9.23507 17.0714 8.60361 16.6532 8.24284C16.2351 7.88207 15.6036 7.9286 15.2428 8.34677L10.7627 13.5396L8.70022 11.5168C8.30592 11.1301 7.67279 11.1362 7.28607 11.5305C6.89935 11.9248 6.90549 12.5579 7.29978 12.9446L10.1233 15.7139C10.3206 15.9074 10.5891 16.0106 10.8651 15.9991C11.1412 15.9876 11.4002 15.8624 11.5807 15.6532L16.7572 9.65323Z"
				/>
			</svg>
		</span>
	)
}

export const AnalyticalIcon = ({
	fillColor,
	backgroundColor,
	borderColor,
}: { fillColor: Colors; backgroundColor: Colors; borderColor: Colors }) => {
	return (
		<span
			className="border-2 rounded-full p-3"
			style={{
				backgroundColor: ColorsWebsite[backgroundColor],
				borderColor: ColorsWebsite[borderColor],
			}}
		>
			<svg
				viewBox="0 0 24 24"
				strokeWidth={2}
				stroke={ColorsWebsite[fillColor]}
				fill="none"
				className="w-6 h-6"
			>
				<title>Analytical</title>
				<path d="M3 3V21" />
				<path d="M21 21H3" />
				<path d="M7 16L12.25 10.75L15.75 14.25L21 9" />
			</svg>
		</span>
	)
}

export const CertifiedIcon = ({
	fillColor,
	backgroundColor,
	borderColor,
}: { fillColor: Colors; backgroundColor: Colors; borderColor: Colors }) => {
	return (
		<span
			className="border-2 rounded-full p-2"
			style={{
				backgroundColor: ColorsWebsite[backgroundColor],
				borderColor: ColorsWebsite[borderColor],
			}}
		>
			<svg
				viewBox="0 0 24 24"
				strokeWidth={2}
				stroke={ColorsWebsite[fillColor]}
				fill="none"
				className="w-8 h-8"
			>
				<title>Certified</title>
				<path d="M9 12L11 14L15 10M12 3L13.9101 4.87147L16.5 4.20577L17.2184 6.78155L19.7942 7.5L19.1285 10.0899L21 12L19.1285 13.9101L19.7942 16.5L17.2184 17.2184L16.5 19.7942L13.9101 19.1285L12 21L10.0899 19.1285L7.5 19.7942L6.78155 17.2184L4.20577 16.5L4.87147 13.9101L3 12L4.87147 10.0899L4.20577 7.5L6.78155 6.78155L7.5 4.20577L10.0899 4.87147L12 3Z" />
			</svg>
		</span>
	)
}

export const CalendarTimerIcon = ({
	fillColor,
	backgroundColor,
	borderColor,
}: { fillColor: Colors; backgroundColor: Colors; borderColor: Colors }) => {
	return (
		<span
			className="border-2 rounded-full p-3"
			style={{
				backgroundColor: ColorsWebsite[backgroundColor],
				borderColor: ColorsWebsite[borderColor],
			}}
		>
			<svg
				viewBox="0 0 24 24"
				fill={ColorsWebsite[fillColor]}
				className="w-6 h-6"
			>
				<title>Calendar Timer</title>
				<path d="M7 1C6.44772 1 6 1.44772 6 2V3H5C3.34315 3 2 4.34315 2 6V20C2 21.6569 3.34315 23 5 23H13.101C12.5151 22.4259 12.0297 21.7496 11.6736 21H5C4.44772 21 4 20.5523 4 20V11H20V11.2899C20.7224 11.5049 21.396 11.8334 22 12.2547V6C22 4.34315 20.6569 3 19 3H18V2C18 1.44772 17.5523 1 17 1C16.4477 1 16 1.44772 16 2V3H8V2C8 1.44772 7.55228 1 7 1ZM16 6V5H8V6C8 6.55228 7.55228 7 7 7C6.44772 7 6 6.55228 6 6V5H5C4.44772 5 4 5.44772 4 6V9H20V6C20 5.44772 19.5523 5 19 5H18V6C18 6.55228 17.5523 7 17 7C16.4477 7 16 6.55228 16 6Z" />
				<path d="M17 16C17 15.4477 17.4477 15 18 15C18.5523 15 19 15.4477 19 16V17.703L19.8801 18.583C20.2706 18.9736 20.2706 19.6067 19.8801 19.9973C19.4896 20.3878 18.8564 20.3878 18.4659 19.9973L17.2929 18.8243C17.0828 18.6142 16.9857 18.3338 17.0017 18.0588C17.0006 18.0393 17 18.0197 17 18V16Z" />
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M24 18C24 21.3137 21.3137 24 18 24C14.6863 24 12 21.3137 12 18C12 14.6863 14.6863 12 18 12C21.3137 12 24 14.6863 24 18ZM13.9819 18C13.9819 20.2191 15.7809 22.0181 18 22.0181C20.2191 22.0181 22.0181 20.2191 22.0181 18C22.0181 15.7809 20.2191 13.9819 18 13.9819C15.7809 13.9819 13.9819 15.7809 13.9819 18Z"
				/>
			</svg>
		</span>
	)
}

export const PasswordIcon = ({
	fillColor,
	backgroundColor,
	borderColor,
}: { fillColor: Colors; backgroundColor: Colors; borderColor: Colors }) => {
	return (
		<span
			className="border-2 rounded-full p-3"
			style={{
				backgroundColor: ColorsWebsite[backgroundColor],
				borderColor: ColorsWebsite[borderColor],
			}}
		>
			<svg
				viewBox="0 0 16 16"
				fill={ColorsWebsite[fillColor]}
				className="w-6 h-6"
			>
				<title>Password</title>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M4 6V4C4 1.79086 5.79086 0 8 0C10.2091 0 12 1.79086 12 4V6H14V16H2V6H4ZM6 4C6 2.89543 6.89543 2 8 2C9.10457 2 10 2.89543 10 4V6H6V4ZM7 13V9H9V13H7Z"
				/>
			</svg>
		</span>
	)
}

export const RightArrowIcon = () => {
	return (
		<svg
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth={1.5}
			stroke="currentColor"
			className="w-6 h-6"
		>
			<title>Right Arrow</title>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
			/>
		</svg>
	)
}

export const ApiAccessIcon = ({
	fillColor,
	backgroundColor,
	borderColor,
}: { fillColor: Colors; backgroundColor: Colors; borderColor: Colors }) => {
	return (
		<span
			className="border-2 rounded-full p-3"
			style={{
				backgroundColor: ColorsWebsite[backgroundColor],
				borderColor: ColorsWebsite[borderColor],
			}}
		>
			<svg
				fill={ColorsWebsite[fillColor]}
				viewBox="0 0 1024 1024"
				className="w-6 h-6"
			>
				<title>API Access</title>
				<path d="M917.7 148.8l-42.4-42.4c-1.6-1.6-3.6-2.3-5.7-2.3s-4.1.8-5.7 2.3l-76.1 76.1a199.27 199.27 0 0 0-112.1-34.3c-51.2 0-102.4 19.5-141.5 58.6L432.3 308.7a8.03 8.03 0 0 0 0 11.3L704 591.7c1.6 1.6 3.6 2.3 5.7 2.3 2 0 4.1-.8 5.7-2.3l101.9-101.9c68.9-69 77-175.7 24.3-253.5l76.1-76.1c3.1-3.2 3.1-8.3 0-11.4zM769.1 441.7l-59.4 59.4-186.8-186.8 59.4-59.4c24.9-24.9 58.1-38.7 93.4-38.7 35.3 0 68.4 13.7 93.4 38.7 24.9 24.9 38.7 58.1 38.7 93.4 0 35.3-13.8 68.4-38.7 93.4zm-190.2 105a8.03 8.03 0 0 0-11.3 0L501 613.3 410.7 523l66.7-66.7c3.1-3.1 3.1-8.2 0-11.3L441 408.6a8.03 8.03 0 0 0-11.3 0L363 475.3l-43-43a7.85 7.85 0 0 0-5.7-2.3c-2 0-4.1.8-5.7 2.3L206.8 534.2c-68.9 69-77 175.7-24.3 253.5l-76.1 76.1a8.03 8.03 0 0 0 0 11.3l42.4 42.4c1.6 1.6 3.6 2.3 5.7 2.3s4.1-.8 5.7-2.3l76.1-76.1c33.7 22.9 72.9 34.3 112.1 34.3 51.2 0 102.4-19.5 141.5-58.6l101.9-101.9c3.1-3.1 3.1-8.2 0-11.3l-43-43 66.7-66.7c3.1-3.1 3.1-8.2 0-11.3l-36.6-36.2zM441.7 769.1a131.32 131.32 0 0 1-93.4 38.7c-35.3 0-68.4-13.7-93.4-38.7a131.32 131.32 0 0 1-38.7-93.4c0-35.3 13.7-68.4 38.7-93.4l59.4-59.4 186.8 186.8-59.4 59.4z" />
			</svg>
		</span>
	)
}

export const LanguageIcon = () => {
	return (
		<svg viewBox="0 0 16 16" className="w-4 h-4" fill="currentColor">
			<title>Language</title>
			<path d="M4 0H6V2H10V4H8.86807C8.57073 5.66996 7.78574 7.17117 6.6656 8.35112C7.46567 8.73941 8.35737 8.96842 9.29948 8.99697L10.2735 6H12.7265L15.9765 16H13.8735L13.2235 14H9.77647L9.12647 16H7.0235L8.66176 10.9592C7.32639 10.8285 6.08165 10.3888 4.99999 9.71246C3.69496 10.5284 2.15255 11 0.5 11H0V9H0.5C1.5161 9 2.47775 8.76685 3.33437 8.35112C2.68381 7.66582 2.14629 6.87215 1.75171 6H4.02179C4.30023 6.43491 4.62904 6.83446 4.99999 7.19044C5.88743 6.33881 6.53369 5.23777 6.82607 4H0V2H4V0ZM12.5735 12L11.5 8.69688L10.4265 12H12.5735Z" />
		</svg>
	)
}

export const GithubIcon = ({ className }: { className?: string }) => {
	return (
		<svg role="img" viewBox="0 0 24 24" {...{ className }} fill="currentColor">
			<title>GitHub</title>
			<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
		</svg>
	)
}
