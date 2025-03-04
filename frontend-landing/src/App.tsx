import './App.css'
import { Navbar } from './modules/core/components/Navbar.tsx'
import { HomePage } from './modules/home/components/HomePage.tsx'

import { AppProvider } from './modules/core/context/AppProvider.tsx'

export const App = () => {
	return (
		<AppProvider>
			<div className="App">
				<Navbar />
				<HomePage />
			</div>
		</AppProvider>
	)
}
