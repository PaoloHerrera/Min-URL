import { Route, Routes, BrowserRouter as Router, Navigate } from 'react-router'
import { Dashboard } from './modules/dashboard/index.tsx'
import { Login } from './modules/login/Login.tsx'
import { Link } from './modules/link/index.tsx'
import { QrCodes } from './modules/qrcodes/index.tsx'
import { useStats } from './modules/core/hooks/useStats.ts'
import type { JSX } from 'react'

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
