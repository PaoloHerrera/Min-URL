import type { JSX } from 'react'
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router'
import { useStats } from './modules/core/hooks/useStats.ts'
import { Dashboard } from './modules/dashboard/index.tsx'
import { Link } from './modules/link/index.tsx'
import { Login } from './modules/login/Login.tsx'
import { QrCodes } from './modules/qrcodes/index.tsx'
import { Register } from './modules/register/Register.tsx'

const AuthRoute = ({ children }: { children: JSX.Element }) => {
	const { isAuthenticated, isLoading } = useStats()

	if (isLoading) {
		return <> </>
	}

	return isAuthenticated ? children : <Navigate to="/login" />
}

const IsLoginRoute = ({ children }: { children: JSX.Element }) => {
	const { isAuthenticated, isLoading } = useStats()

	if (isLoading) {
		return <> </>
	}

	return isAuthenticated ? <Navigate to="/" /> : children
}

const Index = () => {
	const { isAuthenticated, isLoading } = useStats()

	if (isLoading) {
		return <> </>
	}

	return isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
}

export const App = () => {
	return (
		<Router>
			<Routes>
				<Route
					path="/login"
					element={
						<IsLoginRoute>
							<Login />
						</IsLoginRoute>
					}
				/>

				<Route
					path="/register"
					element={
						<IsLoginRoute>
							<Register />
						</IsLoginRoute>
					}
				/>

				<Route path="/" element={<Index />} />
				<Route
					path="/links"
					element={
						<AuthRoute>
							<Link />
						</AuthRoute>
					}
				/>
				<Route
					path="/qrcodes"
					element={
						<AuthRoute>
							<QrCodes />
						</AuthRoute>
					}
				/>
			</Routes>
		</Router>
	)
}
