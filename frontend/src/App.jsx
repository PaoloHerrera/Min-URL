import HomePage from './pages/HomePage'
import './App.css'
import { UrlProvider } from './context/url'
import { ShortUrlProvider } from './context/shortUrl'

function App () {
  return (
    <UrlProvider>
      <ShortUrlProvider>
        <div className='App'>
          <HomePage />
        </div>
      </ShortUrlProvider>
    </UrlProvider>
  )
}

export default App
