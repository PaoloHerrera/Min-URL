import type { Translations } from '@/modules/core/utils/types.d.ts'
import {
	ShieldCheckIcon,
	ActivityIcon,
	UnplugIcon,
	BadgeCheckIcon,
	CalendarClockIcon,
	LockIcon,
	ChartBarIcon,
	EarthIcon,
	ZapIcon,
	RocketIcon,
	HeartIcon,
} from 'lucide-react'
import {} from '../design-system/Icons.tsx'

export const ES_TRANSLATIONS: Translations = {
	navbarLinks: {
		home: 'Inicio',
		features: 'Características',
		pricing: 'Precios',
	},
	navbarButtons: {
		language: 'Español',
		signUp: 'Registrarse',
		signIn: 'Iniciar sesión',
	},
	hero: {
		header: {
			ariaLabel: 'Acortador de URLs y Generador de Códigos QR',
			title: 'Construye enlaces más fuertes',
			subtitle:
				'Un proyecto que permite acortar URLs con un solo click. Construido con React, TypeScript y una arquitectura escalable',
			generatorTitle: 'Genera tu',
			chipTitle: 'Proyecto de Código Abierto 🚀',
		},
		modes: {
			shorturl: 'Min URL',
			qrcode: 'Código QR',
		},
		buttons: {
			shorturl: 'Acortar',
			qrcode: 'Generar',
		},
		formLabels: {
			shorturl: 'Ingresa la URL para acortar',
			qrcode: 'Ingresa la URL para el código QR',
		},
		common: {
			generating: 'Generando...',
			loading: 'Cargando contenido',
			copy: 'Copiar al portapapeles',
			copied: '¡Copiado!',
			open: 'Abrir en una nueva pestaña',
			yourShortUrl: 'Tu URL acortada',
			createdAt: 'Creado hace',
			secondsAgo: 'segundos',
		},
		error: {
			invalidUrl: 'Por favor ingrese una URL válida',
			defaultError:
				'Se ha producido un error. Por favor, inténtalo de nuevo más tarde',
		},
		code: `
	// Min-URL API Example
	const createShortUrl = async (url) => {
		const response = await fetch('/api/shorten', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ url }),
		});
		
		return response.json();
	};
		
	// React Component Example
	const UrlShortener = () => {
		const [url, setUrl] = useState("");
			
		const handleSubmit = async () => {
			const shortUrl = await createShortUrl(url);
			console.log(shortUrl);
		};
		
		return (
			<div className="url-shortener">
				{/* Component Content */}
			</div>
		);
	};`,
	},
	features: [
		{
			id: 'fast-shortening',
			icon: ActivityIcon,
			title: 'Acortamiento instantáneo',
			description:
				'Convierta URLs instantáneamente con nuestro algoritmo optimizado',
		},
		{
			id: 'military-encryption',
			icon: ShieldCheckIcon,
			title: 'Encriptación militar',
			description:
				'Todos los enlaces protegidos con SSL/TLS y cumplimiento GDPR',
		},
		{
			id: 'api-integration',
			icon: UnplugIcon,
			title: 'Integración de la API (Próximamente)',
			description: 'Integra Min-URL con tus herramientas favoritas',
		},
	],
	smartSolutions: {
		header: 'Potencia tu flujo de trabajo',
		subheader: 'Más allá de Acortamiento',
		content: [
			{
				id: 'custom-short-links',
				title: 'Enlaces personalizados',
				icon: BadgeCheckIcon,
				description:
					'Crea enlaces memorables con slugs personalizados que reflejen tu negocio',
			},
			{
				id: 'link-lifecycle-control',
				title: 'Control del ciclo de vida de los enlaces',
				icon: CalendarClockIcon,
				description:
					'Establece fechas de expiración para tus enlaces y mantén el control de tu contenido',
			},
			{
				id: 'password-protection-links',
				title: 'Protección de enlaces con contraseñas',
				icon: LockIcon,
				description:
					'Asegura tus enlaces con contraseñas personalizadas para un acceso controlado y seguro',
			},
			{
				id: 'realtime-analytics',
				title: 'Análisis en tiempo real',
				icon: ChartBarIcon,
				description:
					'Analiza el rendimiento de tus enlaces con estadísticas detalladas de clics',
			},
			{
				id: 'geolocation',
				title: 'Geolocalización',
				icon: EarthIcon,
				description:
					'Obtén la ubicación exacta de tus visitantes para un seguimiento preciso',
			},
			{
				id: 'secure-links',
				title: 'Enlaces Seguros',
				icon: ShieldCheckIcon,
				description:
					'Pretección contra spam y contenido malicioso de manera automática',
			},
		],
	},
	freeSection: {
		header: 'Gratis y Fácil de Usar',
		subheader:
			'Sin registro, sin complicaciones. Con un generoso límite diario por usuario',
		content: [
			{
				id: 'free-links-every-day',
				title: '50 Enlaces Diarios',
				icon: ZapIcon,
				description:
					'Disfruta de 50 enlaces y 25 códigos QR cada día, totalmente gratis',
			},
			{
				id: 'faster-simple',
				title: 'Rápido y Simple',
				icon: RocketIcon,
				description:
					'Interfaz intuitiva diseñada para que acortes URLs en segundos',
			},
			{
				id: 'no-need-registration',
				title: 'No Necesitas Registrarse',
				icon: HeartIcon,
				description:
					'Empieza a usar Min-URL sin registro, simplemente ingresa tu URL y comienza a generar enlaces',
			},
		],
	},
} as const
