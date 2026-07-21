# ADR 004: Rediseño de Base de Datos y Aislamiento de Migraciones (Core vs. Analíticas vs. Usuarios)

- **Estado:** Aceptado
- **Fecha:** 2026-07-20
- **Autor:** Paolo Herrera
- **Versión:** 1.1.0
- **Ultima modificación:** 2026-07-20

---

## Contexto y Problemática

Durante el refactor de arquitectura hexagonal y DDD en `backend-services`, la geolocalización fue rediseñada como un _Value Object_ (`Geolocation`) dentro del VO `IpAddress`. En la base de datos heredada, `geolocations` era una tabla independiente relacionada mediante claves foráneas, lo que generaba acoplamiento innecesario y `JOIN`s complejos para lecturas simples.

Además, la base de datos heredada compartía en un mismo esquema relacional las tablas de usuarios (`users`), las transaccionales del core (`urls`, `slugs`) y las de analíticas (`clicks`, `click_details`). Esta arquitectura de base de datos compartida (_Shared Database_) dificulta la escalabilidad independiente y el mantenimiento.

---

## Opciones Evaluadas

### Opción 1: Mantener el Status Quo (Monolito de Base de Datos en Postgres)

Mantener todas las entidades (`users`, `urls`, `visits`, `geolocations`) dentro del mismo esquema relacional de PostgreSQL con Sequelize.

- **Pro (+):** Cero esfuerzo de mi­gración inicial; se mantienen las Foreign Keys y las transacciones ACID nativas entre usuarios, URLs y analíticas.
- **Contra (-):** Cuello de botella de rendimiento masivo. Las escrituras asimétricas de las analíticas saturan las conexiones y el I/O del disco compartidos con el Core y la Autenticación.
- **Contra (-):** Mantiene la deuda técnica de acoplamiento entre el servicio de usuarios en NestJS y el motor principal de acortamiento.

**Dictamen:** Descartada. Impide medir el aislamiento de servicios y limita el rendimiento del laboratorio.

---

### Opción 2: Separación Total Inmediata (Micro-Databases desde el día 1)

Extraer inmediatamente el sistema en 3 bases de datos físicas independientes: Por ejemplo, MongoDB para Usuarios, PostgreSQL para el Core de URLs, y ClickHouse/TimescaleDB para Analíticas.

- **Pro (+):** Máximo aislamiento arquitectónico y rendimiento óptimo de cada motor para su propósito específico desde el primer día.
- **Contra (-):** Alta complejidad operacional inicial. Introduce demasiada fricción de infraestructura antes de tener datos de estrés reales en el laboratorio.
- **Contra (-):** Impide observar y medir el punto exacto de colapso de PostgreSQL bajo la carga combinada de lecturas/escrituras de analíticas durante las pruebas con K6.

**Dictamen:** Descartada por el momento. Prematura para la fase actual de benchmarking.

---

### Opción 3: Separación Híbrida / Faseada (Opción Elegida)

- **Desacoplar Usuarios inmediatamente:** Mover el dominio de usuarios a su propio servicio (`backend-users` en NestJS) respaldado por una base de datos independiente, relacionándolo con el Core únicamente a través del `user_id` y validación de tokens JWT en memoria.
- **Mantener Core + Analíticas en Postgres pero aislados por código:** Mantener la creación de URLs y el registro de visitas dentro de la misma instancia de Postgres, pero particionando físicamente las migraciones (`/core` vs `/analytics`).

- **Pro (+):** Elimina el acoplamiento de autenticación, separando realmente los servicios.
- **Pro (+):** Permite ejecutar las pruebas de rendimiento de K6 para provocar y documentar el colapso de Postgres en la fase de analíticas antes de realizar una migración a una base de datos independiente.
- **Pro (+):** La carpeta `/analytics` queda modularizada y lista para ser "desmontada" y migrada a una base de datos analítica en una fase posterior sin tocar el Core.

**Dictamen:** Seleccionada. Ofrece el equilibrio ideal entre desacoplamiento práctico y la capacidad de realizar mediciones de estrés controladas.

---

## Decisión

### 1. Persistencia de Geolocalización Inline (JSONB)

Almacenar `ip_address` (como `text`) y `geolocation` (como `JSONB`) de forma inline directamente dentro de la tabla `short_urls` y `visits`, eliminando la tabla relacional `geolocations`. Al ser la geolocalización un _snapshot_ inmutable de una visita y a la generación de enlaces cortos, no hay problemas en la persistencia inline.

### 2. Desacoplamiento del Dominio de Usuarios (Database per Service / JWT Claims)

Remover la tabla `users` de la base de datos del Core. La gestión de usuarios y autenticación se delega por completo a `backend-users`.

- El Core solo almacenará la columna `user_id` (`VARCHAR`/`UUID`) en la tabla `short_urls` como identificador opaco.
- La autorización en el Core se resolverá en memoria mediante la validación de la firma del JWT.

### 3. Clean Slate y Particionado / Modulación de Migraciones

- Mover las migraciones antiguas de Sequelize a `db/legacy/`.
- Dividir las nuevas migraciones en dos directorios independientes:
  - `db/migrations/core/`: Exclusivo para entidades del motor (`short_urls`).
  - `db/migrations/analytics/`: Exclusivo para el registro de visitas (`visits`).

### 4. Simplificación del Esquema del Core (Eliminación de Slugs, QR Codes, Vistas SQL y Renombrado de Tabla)

- **Renombrar la tabla `urls` a `short_urls`:** Para reflejar de forma más precisa el nombre de la entidad (`ShortUrl`) en el dominio y mejorar la semántica física de la base de datos.
- **Eliminar la tabla `slugs`:** Dado que el dominio simplifica el slug a una columna única e indexada (`UNIQUE INDEX`) directamente en la tabla `short_urls`, no se justifica una tabla de mapeo `slugs` separada.
- **Eliminar la tabla `qr_codes`:** El soporte y almacenamiento de códigos QR queda fuera del alcance (Scope) de este laboratorio de benchmarking y pruebas de carga.
- **Eliminar las vistas SQL complejas (como las de métricas de clicks):** Se eliminan todas las vistas de agregación de la base de datos transaccional para esta primera parte. Esto previene cuellos de botella de CPU/IOPS bajo alta carga y desacopla la base de datos principal. En un futuro veremos cómo vamos a delegar el cálculo de las métricas.

---

## Trade-offs y Consecuencias (de la Opción Elegida)

### Relacionadas con el diseño de datos (JSONB Inline)

- **Pro (+):** **Zero Joins.** Se eliminan las consultas de unión para leer la URL y su geolocalización.
- **Pro (+):** **Flexibilidad.** Nuevos atributos del IP/Geo se añaden en el JSONB sin DDL.
- **Contra (-):** **Búsquedas complejas.** Filtrar por campos dentro del JSONB requiere sintaxis específica de Postgres (`geolocation->>'country'`) e índices `GIN` si el volumen escala.

### Relacionadas con el Desacoplamiento de Usuarios

- **Pro (+):** **Autonomía y Alto Rendimiento.** El servicio Core no satura conexiones consultando tablas de usuarios.
- **Contra (-):** **Sin Integridad Referencial SQL.** Al no haber `FOREIGN KEY`, la consistencia ante la eliminación de cuentas de usuario deberá ser lógica cuando se abarque el caso de uso correspondiente (manejada por Soft Delete).

### Relacionadas con el Particionado de Migraciones (Core vs. Analytics)

- **Pro (+):** **Extracción Sencilla a base de datos de analíticas.** Cuando las pruebas de K6 confirmen el límite de la actual base de datos (Postgres), bastará con borrar/deshabilitar la carpeta `db/migrations/analytics/` y apuntar el logger de eventos al nuevo motor.
- **Contra (-):** **Gestión del Migration Runner.** Requiere configurar la herramienta de migraciones para leer de múltiples carpetas de forma ordenada.
