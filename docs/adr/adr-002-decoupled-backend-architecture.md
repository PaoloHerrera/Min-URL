# ADR-002: Reingeniería Arquitectónica del Backend

- **Estado**: Aceptado
- **Fecha**: 2026-06-28
- **Autor**: Paolo Herrera
- **Version**: 1.1.0
- **Última modificación**: 2026-07-18

---

## Contexto y Problemática

El objetivo de este proyecto en su etapa de backend es aplicar el **método científico**: realizar experimentos controlados en contenedores Docker para medir cuántos usuarios concurrentes soporta el sistema, evaluar las latencias críticas (percentiles p95/p99), decidir mediante datos si es necesario utilizar una persistencia políglota (PostgreSQL para transacciones y MongoDB para analíticas de clics) y en última instancia mejorar el rendimiento de la aplicación sin la necesidad de escalar verticalmente los contenedores.

Como el objetivo es experimentar y aprender, se necesita sin lugar a dudas una arquitectura que nos permita cambiar de herramientas de manera fácil y rápida, sin tocar las reglas del negocio.

Anteriormente, la arquitectura de `backend-services` seguía un patrón MVC tradicional. Es importante destacar que **vengo de una formación y experiencia centrada en MVC tradicional, por lo que arquitecturas desacopladas como Hexagonal o Clean son completamente nuevas para mí**. En este modelo inicial, la infraestructura (Sequelize, Express) estaba fuertemente acoplada a la lógica del negocio. Esto impedía cambiar de base de datos o APIs externas con facilidad para los experimentos de carga. Además, al no contar con una suite de pruebas, existía un riesgo constante de introducir regresiones al realizar modificaciones, acumulando deuda técnica.

Para lograr esto con rigurosidad, era indispensable contar con una suite de pruebas automatizadas sólida y poder desarrollar usando **TDD (Desarrollo Guiado por Pruebas)**.

Sin embargo, al intentar escribir pruebas unitarias para los middlewares y controladores de, por ejemplo, la ruta `/direct/shorten`, me encontré con un código altamente acoplado que presentaba tres problemas graves:

1. **Mutación Mágica e Invisible del Request (`req`)**:
   Middlewares como `addGeolocation` realizaban consultas directas a la base de datos y mutaban el objeto `req` inyectando propiedades de base de datos (`req.geolocation`). El controlador dependía de esta mutación de forma implícita. Esto creaba un **acoplamiento temporal invisible**: si se cambiaba el orden de los middlewares o uno fallaba, el controlador crasheaba con errores de tipo en tiempo de ejecución.
2. **Dependencias "Soldadas" (Imports Rígidos)**:
   El controlador y los middlewares importaban directamente los modelos de Sequelize y servicios de base de datos. Al intentar escribir un test unitario rápido de la lógica, Node intentaba levantar conexiones reales a PostgreSQL. Para evitarlo, se tendría que "hackear" el sistema de archivos del test runner usando `vi.mock()`, lo cual es frágil, lento y difícil de mantener. Esto también traía un problema si decidía, debido a pruebas, cambiar la base de datos.
3. **Problemas de tipos (JavaScript puro)**:
   `backend-services` estaba completamente escrito en JavaScript, esto generaba un problema de seguridad grave en tiempo de compilación que podría generar errores en tiempo de ejecución.

---

## Alternativas Evaluadas

Para tomar la mejor decisión posible, tuve que investigar sobre otros tipos de arquitectura para ver cuál cumplía de mejor manera con los objetivos. Acá hubo tres alternativas a evaluar:

### Opción A: Mantener Arquitectura MVC Tradicional (Layered Architecture)

Mantener el backend estructurado en capas tradicionales (Controlador -> Servicio -> ORM/Modelos), donde las dependencias fluyen de manera lineal y descendente hacia la base de datos y herramientas de infraestructura.

- **Ventajas (Pros):**
  - **Menor boilerplate:** Evita tener que definir interfaces (puertos) o clases mappers específicas para transferir datos de un lado a otro.
  - **Curva de aprendizaje baja:** Es un estándar de desarrollo común en Node.js/Express, por lo que es rápido de entender para cualquier desarrollador.
  - **Desarrollo inicial veloz:** Menos archivos y menos código para poner en marcha el primer caso de uso.
- **Desventajas (Cons):**
  - **Acoplamiento rígido:** La lógica de negocio depende directamente del ORM (Sequelize) y del motor de base de datos (PostgreSQL). Si se deseara migrar una parte de las escrituras o lectura de analíticas a otro motor (como MongoDB o Redis) debido a pruebas de carga, se requeriría reescribir y refactorizar casi todo el backend.
  - **Dificultad extrema de testeo (TDD inviable):** Intentar testear la lógica de negocio obliga a levantar la infraestructura de base de datos o realizar configuraciones frágiles de mocks globales a nivel del test runner (e.g. `vi.mock`), lo que ralentiza y desalienta la escritura de pruebas.
  - **Fugas de infraestructura:** La lógica de negocio queda expuesta y acoplada a detalles de Express (como mutar el objeto `req`) y del ORM.

### Opción B: Clean Architecture / Onion Architecture

Implementar una estructura de círculos concéntricos de dependencias (Entidades en el centro, rodeadas por Casos de Uso, Adaptadores de Interfaces y Frameworks en la capa más externa).

- **Ventajas (Pros):**
  - **Independencia absoluta:** Ofrece un aislamiento estricto y total del núcleo de negocio frente a librerías y frameworks.
  - **Altamente estructurado:** Define flujos de control muy rigurosos y organizados.
- **Desventajas (Cons):**
  - **Curva de aprendizaje brutalmente empinada:** Para un desarrollador acostumbrado a MVC tradicional, los conceptos de Clean Architecture (Boundary Interactors, Presenters, ViewModels específicos) representan una barrera conceptual masiva y una sobrecarga cognitiva difícil de justificar en este punto.
  - **Sobreingeniería extrema:** Requiere un flujo de datos excesivamente burocrático y una gran cantidad de mappers DTO entre cada uno de los círculos concéntricos, lo cual ralentiza el avance.

### Opción C: Arquitectura Hexagonal (Puertos y Adaptadores) ✅ **Elegida**

Investigué sobre Arquitectura Hexagonal (también llamada "Puertos y Adaptadores") y su propuesta era exactamente lo que necesitaba: aislar la lógica de negocio del mundo exterior para poder cambiar herramientas sin tocar las reglas del negocio. Suena prometedor para mi caso, pero debo admitir que los conceptos de "puerto", "adaptador" y "core" me eran nuevos en ese momento.

- **Ventajas (Pros):**
  - **Desacoplamiento óptimo:** Logra aislar por completo la lógica de negocio de los detalles técnicos sin la complejidad reglamentaria de Clean Architecture.
  - **Testeo instantáneo en milisegundos:** Facilita inyectar adaptadores ficticios en memoria (`InMemUrlRepository`) a los casos de uso para testearlos de forma 100% pura y rápida sin tocar base de datos ni mockear archivos físicos.
  - **Facilita la persistencia políglota y la experimentación:** Permite implementar nuevos adaptadores (como un `MongoClickRepository` en lugar de `SequelizeUrlRepository`) si las pruebas de carga (`k6`) indican cuellos de botella en, por ejemplo, PostgreSQL, simplemente sustituyendo la inyección en el `bootstrap.ts` sin tocar la lógica del hexágono.
- **Desventajas (Cons):**
  - **Curva de aprendizaje y cambio de paradigma significativo:** Al venir de un entorno de MVC clásico, pensar en términos de "Puertos y Adaptadores", separar estrictamente la lógica de la base de datos (puertos secundarios) y del transporte HTTP (puertos primarios), e inyectar dependencias de forma manual, implica desaprender vicios de acoplamiento lineal y requiere tiempo para dominar los patrones conceptuales.
  - **Mayor cantidad de archivos y boilerplate inicial:** Requiere definir interfaces para los puertos, clases adaptadoras, mappers explícitos para traducir datos y configurar la inyección de dependencias en una raíz de composición (`bootstrap.ts`).

---

## Decisión de Arquitectura

La decisión es migrar a **Arquitectura Hexagonal**. Reconozco que no sé cómo se implementa cada componente (puertos, adaptadores, core), pero la dirección es clara: necesito desacoplar la lógica de negocio de Express y Sequelize para poder experimentar con bases de datos y escribir tests rápidos.

El primer caso de uso en migrar fue **ShortenUrl anónimo** (`POST /direct/shorten`), ya que es el core del negocio y el más acoplado al MVC tradicional.

---

## Comparativa de Estructura de Carpetas

### Estructura Antigua (MVC Acoplado)

En el modelo MVC antiguo, todos los archivos dependían directamente del archivo de abajo mediante imports estáticos:

```text
backend-services/
├── controllers/
│   └── userController.js      # Depende de models y services directamente
├── middleware/
│   └── geolocationMiddleware.js # Consulta la base de datos y muta req
├── models/
│   ├── urlModel.js
│   └── index.js
├── routes/
│   └── shorturl.js            # Encadena middlewares acoplados
└── services/
    └── urlServices.js         # Importa modelos directamente
```

### Estructura Nueva (Arquitectura Hexagonal con TS)

Aislamos la lógica pura en `core/` y dejamos que el mundo exterior viva en `adapters/`. El código refactorizado vive en `src/` bajo este patrón:

```text
src/
├── adapters/
│   ├── primary/
│   │   └── http/
│   │       └── url.controller.ts               # Adaptador primario: traduce HTTP al core
│   └── secondary/
│       ├── captcha/
│       │   └── TurnstileCaptchaService.ts       # Adaptador: Cloudflare Turnstile
│       └── db/
│           ├── models/
│           │   ├── Geolocation.model.ts
│           │   ├── Slug.model.ts
│           │   ├── Url.model.ts
│           │   ├── User.model.ts
│           │   ├── clickDetailModel.js           # Pendiente migración a TS
│           │   ├── clickModel.js                 # Pendiente migración a TS
│           │   └── index.js                      # Pendiente migración a TS
│           ├── SequelizeGeolocationService.ts   # Implementa GeolocationRepository
│           └── SequelizeUrlRepository.ts        # Implementa UrlRepository
├── core/                                         # EL HEXÁGONO (lógica pura sin infra)
│   ├── ports/                                    # Contratos: lo que el core necesita
│   │   ├── CaptchaServices.interface.ts
│   │   ├── SlugGenerator.interface.ts
│   │   ├── UrlRepository.interface.ts
│   │   └── geolocationServices.interface.ts
│   ├── services/                                 # Servicios de dominio
│   │   └── RandomBase62SlugGenerator.ts
│   └── usecases/                                 # Casos de uso (orquestadores)
│       ├── getUrlMetadata.usecase.ts
│       └── shortenUrlAnonymous.usecase.ts
└── bootstrap.ts                                  # Composition Root (DI manual)
```

---

## Consecuencias y Trade-offs

### Beneficios (Pros)

- **Testeo en Milisegundos**: Escribir pruebas unitarias para los casos de uso ahora requiere cero bases de datos y cero mocks de archivos físicos. Al inyectar adaptadores ficticios en memoria a través del constructor, los tests se ejecutan de forma instantánea.
- **Separación de Responsabilidades (SRP)**: Los middlewares web vuelven a ser ligeros; ya no realizan consultas complejas de base de datos ni mutan objetos del framework de forma mágica. El controlador de Express solo adapta el protocolo HTTP y delega la ejecución al caso de uso correspondiente.
- **Migración Progresiva (Strangler Fig)**: Gracias a la coexistencia de JS/TS y la flexibilidad de la composición, podemos migrar los endpoints uno a uno. El código legacy puede seguir funcionando en paralelo mientras refactorizamos progresivamente los casos de uso críticos.
- **Preparación para el Laboratorio de Carga (Persistencia Políglota)**: Si en las pruebas de estrés con `k6` se identifica que las escrituras en PostgreSQL son el principal cuello de botella, podemos migrar el adaptador secundario a MongoDB (escribiendo un `MongoClickRepository.ts` que implemente el puerto de dominio) y cambiarlo únicamente en `bootstrap.ts`. El resto de la aplicación y la lógica de negocio permanecerán inalteradas.
- **Aprendizaje**: Este es quizás el valor más importante. Al verme envuelto en un problema así, el aprendizaje que adquiriré valdrá totalmente la pena.

### Compromisos Asumidos (Cons / Trade-offs)

- **Mayor Boilerplate y Volumen de Código**: Cada nuevo flujo requiere crear interfaces para los puertos, implementaciones concretas para los adaptadores y registrar su inyección en la raíz de composición (`bootstrap.ts`). Para flujos muy simples, esto introduce mayor verbosidad que un enfoque MVC tradicional.
- **Curva de Aprendizaje y Rigor Conceptual**: Obliga a no importar directamente dependencias de infraestructura (como Sequelize o Express) en la lógica de negocio. Las dependencias deben fluir estrictamente hacia adentro, lo cual requiere comprender y mantener correctamente el patrón de inversión de dependencias.
- **Refactor de Código Legacy**: Migrar del MVC acoplado implica reescribir middlewares, controladores y servicios existentes, lo que consume tiempo y introduce riesgo de regresiones durante la transición.
- **Tiempo en la implementación**: Si bien está implícito en la suma de todos los Trade-offs, es importante recalcarlo. Cada caso de uso requiere más archivos y más código que su equivalente MVC, lo que ralentiza la velocidad de desarrollo inicial.

---

## Relación con otros ADRs

- **ADR-001**: Previamente, se migró de Google reCAPTCHA v3 a Cloudflare Turnstile. Esta decisión se mantuvo intacta durante la migración a hexagonal.
- **ADR-003**: Documenta la extracción del redirector en un microservicio dedicado (`backend-redirector`) y su migración a Fastify. Esta decisión se tomó en paralelo a la refactorización de `backend-services`.

---

## Resultado

La migración a Arquitectura Hexagonal se completó con éxito para el caso de uso principal (`ShortenUrl anónimo`) y el caso de uso (`Redirección de url`). El código funciona, los tests pasan, y la separación entre el núcleo de negocio y la infraestructura es clara.

---

## Lo que no sabía al empezar

Antes de empezar la implementación, mi investigación sobre arquitectura hexagonal fue breve (menos de una semana). Conocía el concepto general — "aislar la lógica de negocio del mundo exterior" — pero no dominaba los detalles de implementación:

- **No sabía qué eran los Puertos**: La idea de que el núcleo definiera "interfaces" que el mundo exterior implementara me era ajena. Si bien tenía una noción, no tenía idea de cómo se implementaba.
- **No entendía el rol de los Adaptadores**: No tenía claro cómo separar Express (HTTP) de Sequelize (persistencia) en capas distintas.
- **No dominaba la Inyección de Dependencias manual**: Venía de un mundo donde Express resolvía todo con imports estáticos.

**Mi enfoque de aprendizaje fue "learning by doing"**: en lugar de estudiar teoría primero y luego implementar, empecé a codificar desde el primer día utilizando **TDD como guía** y **inteligencia artificial como pair programming**. Mientras implementaba, investigaba cada concepto en el momento exacto en que lo necesitaba. Esta estrategia me permitió avanzar rápido, aunque conllevó errores de diseño que solo detecté después.

## Lección Aprendida: el Dominio Anémico

A medida que avanzaba con el testing, me di cuenta de que había reglas de negocio dispersas en middlewares como `validateSlug.middleware.ts`. Eso viola el principio de que las reglas de negocio deben vivir en el dominio, no en los adaptadores. Además, la arquitectura resultante era **anémica de dominio**: los casos de uso orquestaban strings y objetos planos sin comportamiento, sin un modelo que los protegiera.

Esto me hizo tomar la decisión de que las reglas del negocio deberían estar en el dominio. Analizando los trade-offs (tiempo de implementación, curva de aprendizaje), decidí que lo mejor era incorporar entidades y Value Objects. Para ello, me enfoqué en crear entidades con comportamiento real y VOs que garantizan sus propios invariantes. Los VOs utilizan schemas de Zod (por ejemplo `url.schema.ts`) para validar sus reglas, lo que hace imposible asignar una URL o IP inválida, tanto en tiempo de ejecución como de compilación.

Si bien esto es poco «purista», ya que importa una librería externa en el dominio (exclusivamente en los VOs), lo considero justificable: Zod es una biblioteca ya testeada en producción — escribir las mismas reglas con expresiones regulares propias introduciría edge cases que Zod ya tiene cubiertos.
