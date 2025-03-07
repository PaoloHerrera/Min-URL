import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App.tsx'
import { BrowserRouter, Routes, Route } from 'react-router'
import { Login } from './modules/login/Login.tsx'

createRoot(document.getElementById('root') as HTMLElement).render(
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<App />} />
			<Route path=":lang/login" element={<Login />} />
		</Routes>
	</BrowserRouter>,
)
