import { MinUrlLogo } from '../assets/Icons'
import { Navbar, NavbarBrand } from '@nextui-org/react'

export default function NavbarComponent() {
	return (
		<Navbar height="5rem">
			<NavbarBrand>
				<MinUrlLogo />
				<p className="font-bold text-inherit ml-3">MIN-URL</p>
			</NavbarBrand>
		</Navbar>
	)
}
