import { Route, Routes, BrowserRouter as Router, Navigate } from 'react-router'
import { Dashboard } from './modules/dashboard/index.tsx'
import { Login } from './modules/login/Login.tsx'
import { useStats } from './modules/core/hooks/useStats.ts'
import type { JSX } from 'react'

const AuthRoute = ({ children }: { children: JSX.Element }) => {
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
						<AuthRoute>
							<Login />
						</AuthRoute>
					}
				/>

				<Route path="/" element={<Index />} />
			</Routes>
		</Router>
	)
}
