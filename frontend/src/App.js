import logo from './resources/Logo-transformed.png'
import InputShortUrl from './components/InputShortUrl'
import './App.css'

function App () {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <InputShortUrl />
      </header>
    </div>
  )
}

export default App
