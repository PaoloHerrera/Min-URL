import { useLogin } from './modules/core/hooks/useLogin.tsx'

export const App = () => {
	const { isLoggedIn } = useLogin('en')

	if (isLoggedIn) {
		return <></>
	}

	return <></>
}
