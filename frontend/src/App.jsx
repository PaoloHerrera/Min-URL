import HomePage from './pages/home-page/HomePage'
import './App.css'
import { UrlProvider } from './context/url'
import { ShortUrlProvider } from './context/shortUrl'
import NavbarComponent from './components/NavbarComponent'

function App () {
  return (
    <UrlProvider>
      <ShortUrlProvider>
        <div className='App min-h-[100vh]'>
          <NavbarComponent />
          <main>
            <HomePage />
          </main>
        </div>
      </ShortUrlProvider>
    </UrlProvider>
  )
}

export default App
