# ADR-001 — Migración de Google reCAPTCHA v3 a Cloudflare Turnstile

**Estado:** Aceptado  
**Fecha:** 2026-06-24  
**Autor:** Paolo Herrera  
**Contexto:** Endpoint público de acortado anónimo `POST /direct/shorten` en `frontend-landing` + `backend-services`

---

## Contexto

El endpoint público de acortado de URLs (`/direct/shorten`) necesita protección anti-bot para prevenir abuso automatizado sin requerir autenticación del usuario. La implementación inicial usaba **Google reCAPTCHA v3** (invisible).

Al revisar los requisitos de privacidad del proyecto y el impacto de dependencias externas, se evaluó si continuar con Google reCAPTCHA v3 era la decisión correcta.

---

## Problema

Google reCAPTCHA v3 presenta los siguientes inconvenientes para Min-URL:

1. **Privacidad comprometida**: Envía datos de comportamiento del usuario a los servidores de Google mediante cookies de tracking. Esto no es algo se querría en el proyecto.
2. **Badge obligatorio**: Los Términos de Servicio de Google exigen mostrar un badge visible en la interfaz. Esto añade ruido visual sin valor de UX.
3. **Lógica de score compleja**: reCAPTCHA v3 devuelve un score (0.0–1.0). El backend debe decidir un umbral de corte (ej. `score > 0.5`), lo cual es una variable de configuración adicional que debe calibrarse con el tiempo.
4. **Dependencia de Google**: Agrega una dependencia de infraestructura crítica a un tercero que puede cambiar precios, límites o condiciones.

---

## Opciones Evaluadas

### Opción A: Mantener Google reCAPTCHA v3

- ✅ Ya integrado en el código base
- ❌ Problemas de privacidad (incompatible con el propósito anónimo del servicio)
- ❌ Badge obligatorio en UI
- ❌ Score requiere calibración y lógica adicional en backend

### Opción B: hCaptcha

- ✅ Alternativa a Google con mejor privacidad
- ❌ Versión gratuita limitada, interfaz de puzzle visible
- ❌ UX disruptiva (el usuario debe resolver el captcha)

### Opción C: Cloudflare Turnstile ✅ **Elegida**

- ✅ Privacy-preserving por diseño: sin cookies de tracking ni datos enviados a Google
- ✅ GDPR/CCPA compliant nativo
- ✅ Resultado binario Pass/Fail (más simple que el score de reCAPTCHA)
- ✅ Gratuito sin límites de requests anunciados
- ✅ Sin badge obligatorio
- ✅ API frontend similar a reCAPTCHA (migración mínima)
- ✅ Widget configurable como invisible o con interacción mínima

---

## Decisión

**Se adopta Cloudflare Turnstile** como solución de protección anti-bot para el endpoint público de acortado anónimo.

---

## Consecuencias Técnicas

### Frontend (`frontend-landing`)

**Antes (reCAPTCHA v3):**

```html
<script
	src="https://www.google.com/recaptcha/api.js?render=SITE_KEY"
	async
	defer
></script>
```

```ts
window.grecaptcha.ready(() => {
  window.grecaptcha.execute(SITE_KEY, { action: 'submit' }).then(token => { ... })
})
```

**Después (Turnstile):**

```html
<script
	src="https://challenges.cloudflare.com/turnstile/v0/api.js"
	async
	defer
></script>
```

```ts
// El widget se monta en un contenedor y llama al callback con el token
window.turnstile.render('#turnstile-container', {
	sitekey: SITE_KEY,
	callback: (token: string) => {
		/* guardar token para el submit */
	},
})
```

**Variables de entorno afectadas:**

```bash
# Antes
VITE_RECAPTCHA_SITE_KEY=...

# Después
VITE_TURNSTILE_SITE_KEY=...
```

### Backend (`backend-services`)

**Antes (reCAPTCHA v3):**

```js
// middleware/verifyRecaptcha.js
const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
  method: 'POST',
  body: `secret=${SECRET}&response=${token}`
})
const data = await response.json()
// Requería evaluar: data.success && data.score > 0.5
if (!data.success || data.score < 0.5) return res.status(403).json(...)
```

**Después (Turnstile):**

```js
// middleware/verifyTurnstile.js
const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ secret: SECRET, response: token })
})
const data = await response.json()
// Binario, sin calibración de score
if (!data.success) return res.status(403).json(...)
```

**Variables de entorno afectadas:**

```bash
# Antes
RECAPTCHA_SECRET_KEY=...

# Después
TURNSTILE_SECRET_KEY=...
```

### Tests

Los unit tests del componente (`ShortenerForm.test.tsx`) **no cambian estructuralmente**. En ambas implementaciones, el módulo de captcha se mockea con `vi.mock()`. Solo cambia el nombre del módulo mockeado.

Los tests E2E de Playwright usan las **claves de test oficiales de Cloudflare Turnstile** para evitar llamadas reales durante CI:

| Site Key                   | Secret Key                            | Comportamiento               |
| -------------------------- | ------------------------------------- | ---------------------------- |
| `1x00000000000000000000AA` | `1x0000000000000000000000000000000AA` | Siempre pasa ✅              |
| `2x00000000000000000000AB` | `2x0000000000000000000000000000000AB` | Siempre falla ❌             |
| `3x00000000000000000000FF` | —                                     | Fuerza challenge interactivo |

---

## Archivos Afectados

| Archivo                                                   | Cambio                                                    |
| --------------------------------------------------------- | --------------------------------------------------------- |
| `frontend-landing/src/lib/turnstile.ts`                   | **NUEVO** — módulo de integración con Turnstile           |
| `frontend-landing/src/components/react/ShortenerForm.tsx` | Actualizar integración de captcha                         |
| `frontend-landing/.env.development` / `.env.production`   | `VITE_RECAPTCHA_SITE_KEY` → `VITE_TURNSTILE_SITE_KEY`     |
| `backend-services/middleware/verifyRecaptcha.js`          | **RENOMBRAR** a `verifyTurnstile.js` + actualizar API URL |
| `backend-services/.env`                                   | `RECAPTCHA_SECRET_KEY` → `TURNSTILE_SECRET_KEY`           |

---

## Referencias

- [Cloudflare Turnstile Docs](https://developers.cloudflare.com/turnstile/)
- [Guía de migración desde reCAPTCHA](https://developers.cloudflare.com/turnstile/migration/recaptcha/)
- [Claves de test oficiales](https://developers.cloudflare.com/turnstile/troubleshooting/testing/)
