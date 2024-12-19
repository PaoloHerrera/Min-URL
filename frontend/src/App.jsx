import './App.css'
import { UrlProvider } from './context/UrlProvider'
import { ShortUrlProvider } from './context/ShortUrlProvider'
import NavbarComponent from './components/NavbarComponent'
import { FormComponent } from './components/forms/FormComponent'

function App () {
  return (
    <UrlProvider>
      <ShortUrlProvider>
        <div className='App min-h-[100vh]'>
          <header className='min-h-[100vh] flex flex-col items-center'>
            <NavbarComponent />
            <FormComponent />
          </header>
        </div>
      </ShortUrlProvider>
    </UrlProvider>
  )
}

export default App
