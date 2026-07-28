# Security Policy — Min-URL

> Estado del proyecto: **laboratorio / portfolio en desarrollo activo**. No existe despliegue público de los servicios todavía.

## Reportar una vulnerabilidad

Si encuentras una vulnerabilidad de seguridad en este repositorio, **no abras un issue público**. Repórtala por email a **paolo.herrera.araya@gmail.com** con:

- Descripción del hallazgo y severidad estimada.
- Pasos para reproducirlo (archivo/línea si aplica).
- Impacto potencial.

Compromiso de respuesta: acuse en 72 horas, evaluación y plan de fix en 7 días.

## Auditoría de seguridad propia

Este proyecto se audita a sí mismo de forma periódica. La auditoría más reciente está documentada en **[auditoria-tecnica-2026-07.md](./auditoria-tecnica-2026-07.md)**, que incluye:

- Hallazgos clasificados por severidad (crítico / alto / medio / bajo) con ubicación exacta y fix recomendado.
- Lista de controles verificados como correctos (gestión de secretos, hashing, parametrización SQL, validación en bordes, etc.).
- **Tracker de remediación** con el estado de cada hallazgo.

## Controles de seguridad actuales (resumen)

| Área                 | Control                                                                                     |
| -------------------- | ------------------------------------------------------------------------------------------- |
| Anti-bot             | Cloudflare Turnstile (verificación server-side, timeout, fail-closed) en endpoints públicos |
| Passwords de URLs    | scrypt + salt aleatorio + comparación `timingSafeEqual` (VO `Password`)                     |
| Auth inter-servicios | Token compartido `INTERNAL_SECRET` por cabecera `Authorization: Bearer` (`timingSafeEqual`) |
| SQL                  | Drizzle ORM 100% parametrizado (sin SQL crudo concatenado)                                  |
| Validación           | `httpUrlSchema` en `@min-url/contracts` restringiendo esquemas HTTP/HTTPS y max 2048 chars  |
| Inmutabilidad        | Copia defensiva de `Date` en Entidad `Visit` y sanitización de IP / Referer                 |
| Postgres Constraints | Tipo `varchar` restringido en base de datos (`slug` 12, `original_url` 2048, `ip` 45)       |
| Sesiones             | Cookies `httpOnly` + `SameSite: strict` + `Secure` (prod); tokens nunca en JSON             |
| Secretos             | Ningún `.env` versionado (verificado en todo el historial git)                              |

## Deuda de seguridad conocida (en remediación)

Antes del despliegue a producción (Capítulo 4 del plan) se cerrarán, entre otros:

- Rate limiting en endpoints públicos (requisito previo a `verify-password`, ver ADR-003).
- Headers de seguridad (Helmet) en los 3 servicios.
- Validación de IPs privadas/loopback en URLs de destino (anti open-redirect a infra interna).
- CORS whitelist explícito en todos los microservicios.

El detalle y estado de cada ítem vive en la auditoría técnica.
