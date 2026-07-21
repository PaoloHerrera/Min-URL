# Pull Request Template

Copia y pega esta plantilla cuando vayas a abrir una Pull Request en el repositorio. Rellena las secciones correspondientes eliminando o adaptando las guías de ejemplo.

---

## 🎯 Goal

<!-- Describe el objetivo principal de esta Pull Request. ¿Qué problema resuelve o qué nueva característica introduce? -->
<!-- Explica brevemente la diferencia entre el estado "Antes" y "Después". -->

_Ejemplo: Refactorizar el formulario del acortador de URLs para extraer la lógica a custom hooks y añadir soporte completo de internacionalización (i18n)._

---

## 🏗️ Architecture & Decisions (Optional)

<!-- Explica decisiones clave de diseño de software, patrones aplicados (DDD, Clean Architecture, SOLID) o compromisos técnicos adoptados. -->

_Ejemplo: Separamos la resolución de IP geográfica de la capa de persistencia en dos puertos (IpResolver y GeolocationRepository) para mantener el Core desacoplado de las claves autogeneradas de la base de datos._

---

## 🛠️ Changes Made

<!-- Detalla los cambios de forma estructurada. Usa las secciones que apliquen a tu PR y elimina las demás. -->

### 🛡️ Core & Domain (Business Logic)

- **[Entidad/Caso de Uso/Puerto]**: Cambios realizados y justificación.

### 🔌 Adapters & Infrastructure (HTTP, DB, Integraciones)

- **[Controlador/Middleware/Repositorio]**: Qué cambia en la comunicación externa.

### 🌐 Frontend & UI

- **[Vista/Componente/Hook]**: Modificaciones de interfaz o estado del cliente.

### 🧹 Refactoring & Cleanup (Código Muerto)

- **[Archivos/Módulos]**: Depuraciones, simplificaciones o eliminaciones de archivos obsoletos.

---

## ⚠️ Breaking Changes (Optional)

<!-- Documenta cambios que rompen la compatibilidad con el estado anterior del sistema. -->
<!-- Incluye qué rompió, por qué fue necesario y cómo migrar el código afectado. -->

_Ejemplo: `TargetUrl` ahora tiene constructor `private`. Cualquier `new TargetUrl(value)` fuera de la clase falla en compilación. Usar `TargetUrl.create(value)` para input externo o `TargetUrl.reconstitute(value)` para restaurar desde DB._

---

## 📋 Related ADR / Docs (Optional)

<!-- Enlaza los ADRs, documentos de arquitectura o issues relacionados con esta decisión. -->

- [ADR-00X — Nombre del ADR](../docs/adr/adr-00X-nombre.md)

---

## 📷 Visual Impact (Optional)

<!-- Si los cambios afectan a la interfaz de usuario (UI), añade capturas de pantalla, GIFs o grabaciones del antes y el después. -->

|         Antes         |        Después        |
| :-------------------: | :-------------------: |
| _Captura de pantalla_ | _Captura de pantalla_ |

---

## 🧪 Verification Plan

<!-- Detalla cómo has verificado los cambios para garantizar que todo funciona correctamente. -->

### Pruebas Automatizadas

- **Tests Unitarios / Integración**: `[Comando ejecutado, ej: bun run test]`
- **Linter & Formato**: `[Comando ejecutado, ej: bun run lint]`
- **Typecheck**: `[Comando ejecutado, ej: bun run typecheck]`

### Pruebas Manuales

1. _Describe el flujo que probaste manualmente y el comportamiento observado._
