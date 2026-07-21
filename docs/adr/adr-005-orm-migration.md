# ADR 005: Migración de Sequelize a Drizzle ORM

- **Estado:** Aceptado
- **Fecha:** 2026-07-20
- **Autor:** Paolo Herrera
- **Versión:** 1.0.0

- **Referencias:** [ADR 004: Rediseño de Base de Datos y Aislamiento de Migraciones](./adr-004-database-redesign.md)

---

## Contexto y Problemática

En el [ADR 004](./adr-004-database-redesign.md) se decidió rediseñar y simplificar la base de datos de PostgreSQL, lo cual incluye el renombrado de la tabla principal a `short_urls`, la eliminación de tablas y vistas redundantes, y la consolidación de la geolocalización de forma inline mediante una columna de tipo `JSONB`.

El ORM actual del proyecto, **Sequelize**, presenta varios problemas de fricción e incompatibilidad con las metas del laboratorio y las nuevas definiciones de arquitectura:

1.  **Dificultad con JSONB:** Sequelize no ofrece un soporte nativo tipado en TypeScript para columnas `JSONB`. Mapear el contenido de la columna `geolocation` al Value Object `Geolocation` del dominio requiere castings manuales e inseguros.

2.  **Soporte TypeScript Deficiente:** Sequelize requiere declaraciones de tipos redundantes y duplicadas (`declare public ...`), lo que incrementa el código repetitivo en la capa de persistencia.

3.  **Filosofía Acoplada (Active Record):** Sequelize incentiva un acoplamiento fuerte entre los modelos de la base de datos y la lógica del negocio. En DDD, buscamos separar físicamente las tablas del dominio usando Mappers, donde un ORM con filosofía _Data Mapper_ o un _Query Builder_ resulta más idóneo.

### Premisa de Migración de Datos: Clean Slate

Dado que el proyecto `Min-URL` funciona bajo la tesis de un **laboratorio experimental de benchmarking y pruebas de carga**, no existe una restricción de preservar datos históricos reales en producción. Por tanto, la estrategia de migración asume un escenario de **Clean Slate (Borrón y Cuenta Nueva)**: la base de datos puede ser completamente destruida y recreada usando el nuevo motor de persistencia, eliminando la necesidad de reconciliar o heredar el historial de migraciones de Sequelize.

---

## Opciones Evaluadas

### Opción 1: Mantener Sequelize y refactorizar modelos

Intentar adaptar Sequelize a las nuevas tablas (`short_urls`, `visits`), configurando tipos manuales para el campo `JSONB`.

- **Pro (+):** No requiere instalar nuevas dependencias en `package.json` ni aprender un nuevo DSL.
- **Contra (-):** Mantiene la deuda técnica de declaraciones tipadas redundantes en TypeScript.
- **Contra (-):** El soporte para migrar la base de datos de forma incremental mediante Sequelize Migrations es lento y acoplado a archivos JavaScript antiguos.

**Dictamen:** Descartada. Bloquea la modernización del stack de persistencia y añade complejidad en el mapeo de VOs.

---

### Opción 2: Migrar a Prisma ORM

ORM declarativo basado en un esquema descriptivo propio (`schema.prisma`) y generación automática de cliente (`codegen`).

- **Pro (+):** Sintaxis declarativa limpia, gran ecosistema y excelente documentación.
- **Pro (+):** Soporte moderno para _Driver Adapters_ (ej. utilizando `pg` o `postgres.js` nativo), lo que permite saltarse la ejecución directa del binario Rust de consulta en ciertos entornos.
- **Contra (-):** Incluso con _Driver Adapters_, el motor de Prisma tiene una sobrecarga de traducción de consultas y serialización que genera mayor consumo de memoria y latencia comparativa en escenarios de alto tráfico.
- **Contra (-):** El tipado de campos `JSONB` no es nativo del compilador de Prisma y requiere parches externos (`prisma-json-types`) o aserciones de tipo manuales en cada consulta.

**Dictamen:** Descartada. Añade demasiada sobrecarga operacional y fricción para campos JSONB en TypeScript.

---

### Opción 3: Migrar a TypeORM

El ORM TypeScript más clásico de Node.js, fuertemente inspirado en Hibernate/JPA.

- **Pro (+):** Soporte nativo para el patrón _Data Mapper_, muy popular y con gran cantidad de documentación.
- **Contra (-):** Depende fuertemente de decoradores experimentales de TypeScript, los cuales presentan problemas de compatibilidad y overhead en entornos modernos de ESM y Bun.
- **Contra (-):** Historial largo de lentitud en resolución de issues y bugs de rendimiento en consultas complejas.
- **Contra (-):** Funciona basándose en metadatos generados en tiempo de ejecución a través de la librería `reflect-metadata`. Lo que significa que se deben usar decoradores en Entidades de dominio (lo que provocaría romper la **Arquitectura Hexagonal**) o crear entidades separadas en la infraestructura, lo cual es redundante y verboso.

**Dictamen:** Descartada. Tecnología heredada que no se alinea con la velocidad y tipado moderno requeridos por el laboratorio.

---

### Opción 4: Migrar a MikroORM

Un ORM moderno basado en los patrones _Data Mapper_, _Unit of Work_ e _Identity Map_ (estilo Hibernate).

- **Pro (+):** Diseño arquitectónico ideal para DDD; los cambios en las entidades se rastrean automáticamente en memoria antes de guardarse en la DB (_dirty checking_).
- **Contra (-):** El patrón _Identity Map_ añade "magia" y un estado en memoria del EntityManager que no es necesario para un servicio transaccional simple de redirecciones de URL.
- **Contra (-):** Configuración muy compleja de decoradores y metadatos para mapear adecuadamente los Value Objects e inmutables de dominio.

**Dictamen:** Descartada. Demasiada sobreingeniería para las necesidades de este proyecto.

---

### Opción 5: Migrar a Kysely

Un constructor de consultas SQL (_Query Builder_) puro y 100% tipado en TypeScript.

- **Pro (+):** Excelente rendimiento (idéntico a escribir consultas SQL crudas) y cero magia en memoria.
- **Pro (+):** Máximo control sobre las consultas complejas y optimizaciones de base de datos a nivel de SQL.
- **Contra (-):** No cuenta con una herramienta integrada y automatizada para generar migraciones físicas a partir del esquema TypeScript (aunque esto se podría solucionar combinándolo con `drizzle-kit` de forma externa).
- **Contra (-):** Carece de abstracciones de relaciones de alto nivel, lo que incrementa el código repetitivo (_boilerplate_) para mapear agregados relacionales al dominio en comparación con Drizzle.

**Dictamen:** Descartada. Aunque su rendimiento es excelente, la combinación de Drizzle con `drizzle-kit` provee una mejor ergonomía de desarrollo.

---

### Opción 6: Migrar a Drizzle ORM (Opción Elegida)

Un "ORM headless" y constructor de consultas (_SQL-first_) donde los esquemas se definen directamente en TypeScript nativo.

- **Pro (+):** **Tipado Nativo de JSONB:** Permite asociar un esquema de Zod (o interfaces tipadas) directamente a la definición de la columna en Drizzle (`jsonb().$type<GeolocationProps>()`), garantizando tipado estático real de extremo a extremo sin configuraciones adicionales.
- **Pro (+):** **Zero Codegen:** No tiene paso de generación de código; los tipos se infieren en tiempo real en TypeScript, acelerando el desarrollo.
- **Pro (+):** **Optimizado para Bun:** JS/TS puro y extremadamente ligero, con mínimo overhead sobre el driver nativo de Postgres.
- **Pro (+):** **Drizzle-kit:** Sincroniza y automatiza migraciones en directorios separados de forma limpia.
- **Contra (-):** **Complejidad en transacciones DDD:** En Drizzle, las transacciones se manejan de forma explícita pasándole el cliente transaccional (`tx`) a los métodos correspondientes. Propagar el contexto `tx` entre diferentes repositorios sin acoplar la capa de dominio a Drizzle requiere el uso de patrones manuales.
- **Contra (-):** **API Relacional Inmadura:** La API de relaciones de Drizzle (`db.query.short_urls.findFirst({ with: ... })`) es cómoda pero menos madura que las asociaciones tradicionales de Sequelize, pudiendo requerir `JOIN`s manuales y verbosos para consultas complejas.

**Dictamen:** Seleccionada como la herramienta oficial de persistencia para el refactor.

**Notas:**

- Drizzle puede tener complejidad en transacciones DDD, ya que las transacciones se manejan de forma explícita pasándole el cliente transaccional (`tx`) a los métodos correspondientes. Sin embargo, según [ADR 004: Rediseño de Base de Datos y Aislamiento de Migraciones](./adr-004-database-redesign.md) esto no sería un gran problema ya que el sistema no tiene operaciones multientidad complejas.

- Si bien la API Relacional puede ser inmadura, esto no es un problema debido a que no existen `JOIN`s.

---

## Decisión

Migrar la capa de persistencia de `backend-services` de Sequelize a **Drizzle ORM** utilizando el driver `postgres.js` (o el cliente nativo de PostgreSQL de Bun).

Esto implica:

1.  Definir los esquemas en TypeScript usando las APIs de Drizzle en `src/adapters/secondary/db/schema/`.
2.  Utilizar `drizzle-kit` para generar y ejecutar las migraciones organizadas bajo las carpetas modulares (`db/migrations/core` y `db/migrations/analytics`).
3.  Reescribir los repositorios (`SequelizeUrlRepository` pasará a ser `DrizzleShortUrlRepository`).

---

## Trade-offs y Consecuencias (de la Opción Elegida)

- **Pro (+):** Tipado estático completo de extremo a extremo (incluyendo el campo `JSONB`).
- **Pro (+):** Rendimiento máximo y bajo consumo de memoria en el runtime de Bun.
- **Pro (+):** Migraciones en SQL puro generadas al instante por `drizzle-kit` basadas en cambios sobre archivos TypeScript.
- **Contra (-):** Requiere un esfuerzo de reescritura de toda la capa de infraestructura del `backend-services`.
- **Contra (-):** Requiere familiarizarse con la sintaxis y comandos de Drizzle.
