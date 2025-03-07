import {
	Card,
	CardBody,
	CardHeader,
	CardFooter,
} from '@/modules/core/design-system/Card.tsx'
import type { LoginCardProps } from '@/types'
import { LoginButton } from './LoginButton.tsx'

export const LoginCard = ({ information }: LoginCardProps) => {
	const {
		logo: Logo,
		companyName,
		title,
		description,
		buttons,
		footer,
		terms,
		conect,
		privacy,
	} = information

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center gap-2">
					<div className="flex items-center justify-center">
						<Logo />
					</div>
					<div className="text-center">
						<p className="text-xl font-bold text-mariner-500">{companyName}</p>
					</div>
				</div>
			</CardHeader>
			<CardBody>
				<h1 className="text-3xl font-extrabold text-mariner-950">{title}</h1>
				<p className="text-md text-mariner-950 opacity-80">{description}</p>
				<div className="mt-6 flex flex-col gap-4">
					{buttons.map((button) => (
						<LoginButton key={button.text} {...button} />
					))}
				</div>
			</CardBody>
			<CardFooter>
				<div className="flex">
					<p className="text-center font-normal text-sm text-mariner-950">
						{footer}{' '}
						<a
							href="https://github.com/Min-URL/min-url"
							target="_blank"
							rel="noreferrer"
							className="text-blue-500 hover:underline"
						>
							{terms}
						</a>{' '}
						{conect}{' '}
						<a
							href="https://github.com/Min-URL/min-url"
							target="_blank"
							rel="noreferrer"
							className="text-blue-500 hover:underline"
						>
							{privacy}
						</a>
					</p>
				</div>
			</CardFooter>
		</Card>
	)
}
