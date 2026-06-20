import type { Translations } from './types.ts'

export const es: Translations = {
	nav: {
		home: 'Inicio',
		features: 'Características',
		dashboard: 'Panel',
		why: 'Por qué',
		faq: 'FAQ',
		sponsor: 'Apoyar',
		login: 'Iniciar Sesión',
		register: 'Registrarse',
		language: 'Idioma',
		theme: 'Tema',
		themeLight: 'Claro',
		themeDark: 'Oscuro',
	},
	hero: {
		titleStart: 'Construye enlaces',
		titleGradient: 'más cortos y potentes',
		description:
			'Acorta URLs y genera códigos QR dinámicos al instante. Analiza las métricas en tiempo real con una arquitectura de microservicios robusta y ultrarrápida.',
		shortener: {
			placeholder: 'https://ejemplo.com/mi-url-larga',
			button: 'Acortar URL',
			loading: 'Procesando...',
			errorEmpty: 'Por favor, introduce un enlace',
			errorInvalid: 'Por favor, ingresa una URL válida.',
			successTitle: 'Tu enlace acortado está listo',
			copied: '¡Copiado!',
			copy: 'Copiar',
			visit: 'Visitar',
			downloadQr: 'Descargar QR',
		},
		qrTool: {
			tab: 'Generador QR',
			placeholder: 'https://ejemplo.com/mi-url-larga',
			button: 'Generar QR',
			downloadQr: 'Descargar QR',
			errorInvalid: 'Por favor, ingresa una URL válida.',
		},
		trust: {
			noAccount: 'Sin cuenta requerida',
			free: '100% gratis para siempre',
			openSource: 'Código abierto MIT',
		},
		mockup: {
			title: 'MIN-URL ANALYTICS',
			clicks: 'Clics Totales',
			today: '+24% hoy',
			countries: 'Principales Países',
			spain: 'España',
			usa: 'Estados Unidos',
			mobile: 'Móvil',
			desktop: 'Escritorio',
		},
	},
	features: {
		badge: 'Todo lo que necesitas',
		title: 'Herramientas avanzadas para el control de tus enlaces',
		description:
			'Min-URL no es solo un acortador básico. Diseñamos un flujo de trabajo premium que te brinda analíticas completas de forma no bloqueante.',
		stats: 'Vistas',
		items: {
			instant: {
				title: 'Acortamiento Instantáneo',
				desc: 'Convierte enlaces largos en links cortos memorables en milisegundos gracias a nuestro generador optimizado.',
			},
			analytics: {
				title: 'Analíticas en Tiempo Real',
				desc: 'Métricas de rendimiento en vivo incluyendo clics diarios, países de procedencia y tipos de dispositivo.',
			},
			geo: {
				title: 'Geolocalización Offline',
				desc: 'Mapeo geográfico de visitantes integrado sin necesidad de APIs externas, garantizando privacidad y velocidad.',
			},
			control: {
				title: 'Control del Enlace',
				desc: 'Soporte para slugs personalizados, fechas de expiración automáticas y protección de URLs con contraseña.',
			},
		},
	},
	architecture: {
		badge: 'Arquitectura Monorepo',
		title: 'Diseñado para Escalabilidad Real',
		description:
			'Min-URL está construido como un **monorepo estructurado con Turborepo y Bun**. Se separa la lógica de redirección de la lógica administrativa para maximizar la velocidad y seguridad.',
		packages: {
			users: {
				name: 'backend-users (NestJS 11)',
				desc: 'Maneja la autenticación segura por OAuth 2.0 (Google) y provee datos agregados al panel administrativo.',
			},
			services: {
				name: 'backend-services (Express)',
				desc: 'API principal de servicios para acortar links, crear QR Codes y escribir analíticas de forma asíncrona.',
			},
			redirector: {
				name: 'backend-redirector (Remix SSR)',
				desc: 'Motor de redirecciones ultra rápido. Realiza el tracking del visitante y publica el evento en Redis.',
			},
			infra: {
				name: 'Infraestructura (Docker)',
				desc: 'Contenedores Docker Compose locales para PostgreSQL 16 (Base de datos relacional con índices y vistas) y Redis (Cola de eventos).',
			},
		},
		sponsorTitle: 'Proyecto 100% Open Source y Listo para Desplegar',
		sponsorDesc:
			'Este proyecto está liberado bajo la licencia MIT. Puedes clonarlo, ejecutar la base de datos localmente mediante Docker Compose y desplegar la API en tu propio servidor VPS sin limitaciones.',
		githubBtn: 'Ver en GitHub',
		coffeeBtn: 'Invítame un café ☕',
	},
	footer: {
		text: 'Min-URL. Licencia MIT. Desarrollado con ❤️',
	},
}
