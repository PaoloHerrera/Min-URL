import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App.tsx'
import { Toaster } from './modules/core/ui/sonner.tsx'

createRoot(document.getElementById('root') as HTMLElement).render(
	<>
		<App />
		<Toaster />
	</>,
)
