# Min-URL

Min-URL es un servicio de acortador de URLs desarrollado con Node.js, Express y MySQL. Permite a los usuarios acortar URLs largas y redirigirlas fácilmente utilizando URLs cortas.

## Características

- Acortar URLs largas a URLs cortas
- Almacenar y gestionar URLs en una base de datos MySQL

## Tecnologías

- Node.js
- Express
- MySQL
- Sequelize (ORM para MySQL)
- Dotenv (para la gestión de variables de entorno)

## Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/tu-usuario/min-url.git
   cd min-url/backend/

2. Instala dependencias:

  ```bash
  npm install

4. Crea un archivo .env en la carpeta /backend/ del proyecto y configura las variables de entorno según sea necesario:

DB_NAME=tu_nombre_de_base_de_datos
DB_USER=tu_usuario_de_base_de_datos
DB_PASS=tu_contraseña_de_base_de_datos
DB_HOST=tu_host_de_base_de_datos

5. Inicia el servidor:

  ```bash
  npm start


Licencia
Este proyecto está bajo la Licencia MIT.