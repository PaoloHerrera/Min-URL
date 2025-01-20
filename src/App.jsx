import './App.css'
import { UrlProvider } from './context/UrlProvider'
import { ShortUrlProvider } from './context/ShortUrlProvider'
import NavbarComponent from './components/NavbarComponent'
import HomePage from './pages/home-page/HomePage'

function App() {
	return (
		<UrlProvider>
			<ShortUrlProvider>
				<div className="App">
					<NavbarComponent />
					<HomePage />
				</div>
			</ShortUrlProvider>
		</UrlProvider>
	)
}

export default App
