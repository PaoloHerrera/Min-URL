# ADR-006: Analítica de Clics Síncrona en el Core de backend-services

- **Estado**: Propuesto
- **Fecha**: 2026-07-25
- **Autor**: Paolo Herrera

---

## Contexto y Problemática

Min-URL no es únicamente un acortador de URLs en producción, sino primariamente un **laboratorio de ingeniería de software, arquitectura y benchmarking controlado**. Su objetivo metodológico es comparar cuantitativamente patrones arquitectónicos (síncrono vs. asíncrono, relacional vs. in-memory, monolito vs. microservicios) basándose en mediciones empíricas de rendimiento y observabilidad.

El flujo de redirección (`GET /:slug` → `HTTP 302 Found`) representa el camino crítico del sistema, donde la latencia (TTFB) es percibida directamente por el usuario final. El registro analítico de clics (persistir en tabla `visits`, geolocalización por IP y actualizar `clicks_count`) plantea la decisión de **dónde** y **cuándo** ejecutarse:

- **Dónde**: Dentro del servicio core (`backend-services`) o en un worker/proceso consumidor independiente.
- **Cuándo**: De forma síncrona en el camino crítico del redirect o de forma asíncrona desacoplada mediante colas de eventos (ej: Redis Streams).

Para poder medir en los Capítulos 2 y 3 del proyecto el impacto real y el costo de infraestructura de un sistema asíncrono desacoplado, **es estrictamente necesario construir primero una línea de base (baseline) ingenua y medible** en el Capítulo 1 (MVP).

## Alternativas Evaluadas

### Opción A: Analítica asíncrona desde el día 1 (cola + worker via Redis Streams)

- **Pro (+):** El camino crítico del redirect no paga el costo de la escritura en base de datos; latencia TTFB mínima.
- **Contra (-):** Introduce complejidad de infraestructura y modos de fallo adicionales (lag de consumidor, pérdida de eventos, reintentos) de forma prematura.
- **Contra (-):** **Impide el benchmarking:** Si se implementa asíncrono desde el día 1, se pierde la capacidad de medir cuantitativamente qué beneficio real aportó la asincronía frente a una implementación síncrona limpia.

**Dictamen:** Descartada para el MVP. Se implementará deliberadamente en el Capítulo 2 como experimento comparativo contra la línea de base.

### Opción B: Servicio o worker de analítica separado desde el día 1

- **Pro (+):** Aislamiento físico de la carga analítica desde el inicio.
- **Contra (-):** Contradice el **ADR-004** (separación híbrida y faseada con PostgreSQL y migraciones particionadas). Incrementa la sobrecarga operacional sin datos de carga que lo justifiquen.

**Dictamen:** Descartada por el momento. Se evaluará en un futuro si esta opción es válida bajo ciertos contextos.

### Opción C: Analítica síncrona en el core de backend-services (Línea de Base / Baseline) ✅ **Elegida**

- **Pro (+):** **Establece la línea de base (baseline) del laboratorio:** Proporciona un punto de comparación exacto para medir la degradación de latencia (P90/P95/P99) bajo alta carga en PostgreSQL durante el Capítulo 2.
- **Pro (+):** **Simplicidad y consistencia:** El `VisitShortUrlUseCase` resuelve la geolocalización (`geoip-lite`), persiste la visita y actualiza `clicks_count` atómicamente en PostgreSQL en la misma petición interna. Consistencia inmediata garantizada.
- **Pro (+):** **Reversibilidad por Arquitectura Hexagonal:** La capa de aplicación (`VisitShortUrlUseCase`) depende únicamente del puerto `VisitRepository`. Reemplazar la persistencia síncrona por la emisión de un evento a Redis Streams en el futuro solo requerirá cambiar el adaptador secundario, manteniendo el Dominio 100% intacto.

**Dictamen:** Seleccionada para el Capítulo 1 (MVP).

## Decisión

1. La tabla `visits` y el caso de uso `VisitShortUrlUseCase` se ejecutan en **backend-services** dentro de PostgreSQL (misma base de datos, migraciones particionadas en `db/migrations/analytics/`).
2. El registro de la visita se realiza de forma **síncrona** dentro del flujo de resolución del slug en el Capítulo 1, sirviendo como **línea de base (baseline)** para el laboratorio.
3. Esta decisión será evaluada cuantitativamente en el Capítulo 2 mediante pruebas de carga con **K6** e instrumentación con **Prometheus/Grafana**.

## Criterios de Evaluación y Reversibilidad

NOTA: Estos criterios pueden cambiar en el futuro. La hipótesis se determinará en un momento puntual del proyecto.

Esta decisión arquitectónica se evaluará de acuerdo a los siguientes criterios empíricos durante el Capítulo 2:

1. **Punto de Inflexión (Codo de Latencia):** Identificar con K6 a qué nivel de RPS (Requests Per Second) la saturación del pool de conexiones de PostgreSQL en escrituras síncronas dispara la latencia P95 del redirect por encima de los 100ms.
2. **Reversibilidad Hexagonal:** Validar que la transición al enfoque asíncrono con Redis Streams (Capítulo 2) se realice mediante la implementación de un nuevo adaptador de salida sin modificar la lógica del `VisitShortUrlUseCase`.
3. **Experiencia de Usuario Final (UX):** Validar el TTFB del redirect y determinar si la latencia síncrona es aceptable para la experiencia del usuario bajo carga. Comparar con la experiencia de usuario de manera asíncrona bajo la misma carga.

## Consecuencias y Trade-offs

- **Pro (+):** MVP completado con el mínimo código e infraestructura requeridos, estableciendo un baseline riguroso para la investigación.
- **Pro (+):** Consistencia escritura-lectura inmediata.
- **Contra (-):** El camino crítico del redirect asume el costo de la escritura en PostgreSQL. Este trade-off es aceptado conscientemente como la condición experimental necesaria para las futuras pruebas de carga.

## Relación con otros ADRs

- **ADR-003**: Define el flujo de redirección (Fastify + endpoint interno) sobre el cual se ejecuta el registro síncrono.
- **ADR-004**: Garantiza el aislamiento de la analítica mediante migraciones particionadas (`analytics/`), permitiendo extraer la persistencia sin tocar las tablas core.
- **ADR-005**: Utiliza Drizzle ORM como motor de persistencia tipado. Esto hace reversible la decisión.
