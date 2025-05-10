import { MinUrlIcon, GithubIcon } from '@/modules/core/design-system/Icons'
import { MailIcon } from 'lucide-react'
import type { Translations } from '@/types'
import { VITE_GOOGLE_LOGIN_LINK, VITE_GITHUB_LOGIN_LINK } from '@/constants'

export const ES_TRANSLATIONS: Translations = {
	login: {
		logo: MinUrlIcon,
		companyName: 'Min-URL',
		title: 'Bienvenido a Min-URL',
		description:
			'Inicia sesión para acceder a tu panel y comenzar a crear enlaces cortos en tiempo real.',
		buttons: [
			{
				icon: MailIcon,
				text: 'Iniciar sesión con Google',
				link: VITE_GOOGLE_LOGIN_LINK,
			},
			{
				icon: GithubIcon,
				text: 'Iniciar sesión con GitHub',
				link: VITE_GITHUB_LOGIN_LINK,
			},
		],
		footer: 'Al iniciar sesión, aceptas nuestros',
		terms: 'Términos de servicio',
		conect: 'y',
		privacy: 'Política de privacidad',
	},
	dashboard: {
		navbar: {
			greetings: {
				morning: 'Buenos días',
				afternoon: 'Buenas tardes',
				evening: 'Buenas noches',
			},
			createNew: {
				new: 'Crear nuevo',
				link: 'Enlace corto',
				qrCode: 'Código QR',
			},
			search: 'Buscar enlaces',
			notifications: {
				title: 'Notificaciones',
				empty: 'Aún no hay notificaciones',
				seeAll: 'Ver todo',
			},
			profile: {
				title: 'Perfil',
				language: 'Idioma',
				logout: 'Cerrar Sesión',
			},
			dialogNewLink: {
				title: 'Crear nuevo enlace corto',
				description: 'Acorta un URL largo y personaliza tu enlace.',
				urlTitle: {
					label: 'Título',
					placeholder: 'Título del enlace',
					error: {
						minLength: 'La longitud mínima es de 1',
						maxLength: 'La longitud máxima es de 100',
						generic:
							'Error al verificar el título. Por favor, inténtalo de nuevo.',
					},
				},
				originalUrl: {
					label: 'URL del sitio web',
					placeholder: 'https://ejemplo.com/muy/largo/url/que/necesita/acortar',
					error: {
						minLength: 'La longitud mínima es de 1',
						invalid: 'URL inválida',
						generic:
							'Error al verificar la URL. Por favor, inténtalo de nuevo.',
					},
				},
				questionSlug: {
					label: '¿Personalizar tu slug?',
				},
				customSlug: {
					label: 'Slug personalizado',
					placeholder: 'mi-enlace-personalizado',
					error: {
						minLength: 'La longitud mínima es de 6',
						maxLength: 'La longitud máxima es de 12',
						invalid: 'Caracteres inválidos. Sólo se permiten letras y números',
						tooManyRequests:
							'Demasiadas solicitudes. Por favor, espera un minuto e inténtalo de nuevo',
						alreadyInUse: 'El enlace ya está en uso',
						generic:
							'Error al verificar el slug. Por favor, inténtalo de nuevo.',
					},
				},
				cancelText: 'Cancelar',
				submitText: 'Crear enlace corto',
				loadingSubmitText: 'Creando enlace corto...',
				submitError:
					'Error al crear el enlace corto. Por favor, inténtalo de nuevo más tarde.',
			},
			successLink: {
				title: 'Enlace creado con éxito!',
				description: 'Tu enlace acortado está listo para usar y compartir.',
				linkStatistics: {
					title: 'Estadísticas del enlace',
					status: 'Estado:',
					active: 'Activo',
					clicks: 'Clics:',
					created: 'Creado:',
					expires: 'Expira:',
					never: 'Nunca',
				},
				copyLink: 'Copiar enlace',
				done: 'Hecho',
			},
			dialogNewQr: {
				title: 'Crear nuevo código QR',
				description: 'Genera un código QR para un sitio web.',
				qrCodeTitle: {
					label: 'Título',
					placeholder: 'Mi código QR genial',
					error: {
						minLength: 'La longitud mínima es de 1',
						maxLength: 'La longitud máxima es de 100',
						generic:
							'Error al verificar el título. Por favor, inténtalo de nuevo.',
					},
				},
				originalUrl: {
					label: 'URL del sitio web',
					placeholder:
						'https://ejemplo.com/muy/largo/url/que/necesita/generar/un/código/qr',
					error: {
						minLength: 'La longitud mínima es de 1',
						invalid: 'URL inválida',
						generic:
							'Error al verificar la URL. Por favor, inténtalo de nuevo.',
					},
				},
				preview: 'Vista previa del código QR',
				previewDescription: 'Vista previa usando datos de muestra',
				foregroundColor: 'Color de primer plano',
				backgroundColor: 'Color de fondo',
				cancelText: 'Cancelar',
				submitText: 'Generar código QR',
				loadingSubmitText: 'Creando código QR...',
				submitError:
					'Error al generar el código QR. Por favor, inténtalo de nuevo más tarde.',
			},
		},
		sidebar: {
			usage: {
				link: 'Uso de enlaces',
				qrcode: 'Uso de códigos QR',
				used: 'Usados',
				remaining: 'Restantes',
			},
			footer: {
				support: 'Soporte',
			},
		},
		content: {
			kpis: {
				totalClicks: 'Clicks totales',
				todayClicks: 'Clicks hoy',
				activeLinks: 'Enlaces activos',
				percentageUniqueClicks: 'Porcentaje de clicks únicos',
			},
			last7DaysClicksTitle: 'Clicks de los últimos 7 días',
			deviceTitle: 'Tipos de dispositivos',
			geographicTitle: 'Distribución geográfica',
			noData: 'No hay datos disponibles',
		},
	},

	link: {
		linkCard: {
			copy: 'Copiar enlace',
			externalLink: 'Abrir enlace original',
			statistics: 'Ver estadísticas',
			edit: 'Editar enlace',
			delete: 'Eliminar enlace',

			deleteDialog: {
				title: '¿Estás seguro de que quieres eliminar este enlace?',
				description:
					'Esta acción no se puede deshacer. Eliminará permanentemente tu enlace y todas las estadísticas asociadas.',
				cancelLabel: 'Cancelar',
				deleteLabel: 'Eliminar',
				loadingDelete: 'Eliminando...',
				success: 'Enlace eliminado exitosamente',
				errorLabel:
					'Error al eliminar enlace. Por favor, inténtalo de nuevo más tarde.',
			},
		},
		editDialog: {
			title: 'Editar enlace',
			description: 'Actualiza la configuración de tu enlace.',
			urlTitle: {
				label: 'Título',
				placeholder: 'Mi enlace genial',
				error: {
					minLength: 'La longitud mínima es de 1',
					maxLength: 'La longitud máxima es de 100',
					generic:
						'Error al verificar el título. Por favor, inténtalo de nuevo.',
				},
			},
			originalUrl: {
				label: 'URL del sitio web',
				placeholder: 'https://ejemplo.com/muy/largo/url/que/necesita/acortar',
				error: {
					minLength: 'La longitud mínima es de 1',
					invalid: 'URL inválida',
					generic: 'Error al verificar la URL. Por favor, inténtalo de nuevo.',
				},
				cannotBeChanged: {
					prefix: 'Este enlace ha sido clicado ',
					suffix: ' veces y la URL del sitio web no se puede cambiar.',
				},
			},
			cancelLabel: 'Cancelar',
			submitLabel: 'Actualizar enlace',
			loadingSubmit: 'Actualizando...',
			submitError:
				'Error al actualizar el enlace. Por favor, inténtalo de nuevo más tarde.',
		},
	},

	qrcode: {
		qrcodeCard: {
			details: 'Ver detalles',
			download: 'Descargar código QR',
			externalLink: 'Abrir enlace original',

			deleteDialog: {
				title: '¿Estás seguro de que quieres eliminar este código QR?',
				description:
					'Esta acción no se puede deshacer. Eliminará permanentemente tu código QR y todas las estadísticas asociadas.',
				cancelLabel: 'Cancelar',
				deleteLabel: 'Eliminar',
				loadingDelete: 'Eliminando...',
				success: 'Código QR eliminado exitosamente',
				errorLabel:
					'Error al eliminar código QR. Por favor, inténtalo de nuevo más tarde.',
			},
		},
	},

	timeAgo: {
		now: 'Justo ahora',
		minute: 'hace 1 minuto',
		minutes: 'minutos atrás',
		hour: 'hace 1 hora',
		hours: 'horas atrás',
		day: 'hace 1 día',
		days: 'días atrás',
		week: 'hace 1 semana',
		weeks: 'semanas atrás',
		month: 'hace 1 mes',
		months: 'meses atrás',
		year: 'hace 1 año',
		years: 'años atrás',
	},
}
