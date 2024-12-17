import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { NextUIProvider } from '@nextui-org/react'
import { UrlProvider } from './context/url'
import { ShortUrlProvider } from './context/shortUrl'

import App from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NextUIProvider>
      <UrlProvider>
        <ShortUrlProvider>
          <App />
        </ShortUrlProvider>
      </UrlProvider>
    </NextUIProvider>
  </StrictMode>
)
