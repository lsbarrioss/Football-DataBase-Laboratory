# Carga de datos de partidos de futbol

Programa en Node.js que lee `data/football_matches.csv` y lo guarda en una base de datos MySQL con cuatro tablas: `team`, `season`, `football_match` y `participation`.

## Antes de empezar

Se debe tener instalado:

- Node.js 18 o superior
- MySQL 8.0.16 o superior, encendido, y un usuario que pueda crear bases de datos (el usuario `root` sirve)

## Pasos

1. Descarga el proyecto y abre una terminal dentro de la carpeta.

2. Instala las librerias:

   ```
   npm install
   ```

3. Crea tu archivo `.env`. Este archivo no viene en el repositorio a proposito: ahi va tu contrasena de MySQL y cada persona tiene la suya. Lo que viene es la plantilla `.env.example`, que tienes que copiar:

   ```
   copy .env.example Y pegarlo en el archivo que creaste -> .env
   ```

4. Abre el `.env` que acabas de crear y cambia estos valores por los de tu MySQL:

   | Variable | Que poner |
   |---|---|
   | `DB_HOST` | `localhost` (si MySQL esta en tu mismo computador) |
   | `DB_USER` | tu usuario de MySQL, por ejemplo `root` |
   | `DB_PASSWORD` | tu contrasena de MySQL. Si tiene `#` o espacios, escribela entre comillas. Si no tiene, deja la linea vacia |
   | `DB_NAME` | `football_db` (no lo cambies) |
   | `CSV_PATH` | `data/football_matches.csv` (no lo cambies) |
   | `PORT` | `5000` (solo se usa con `npm start`) |

5. Crea la base de datos y las tablas:

   Debes abrir `sql/schema.sql` en MySQL Workbench y ejecutarlo.

6. Carga los datos:

   ```
   npm run load
   ```

   Si todo sale bien, al final se ven 37 equipos, 11 temporadas, 4070 partidos y 8140 participaciones.

   o puedes correr
   ```
   node server.js
   ```
   y abrir en tu navegador:
   ```
   http://localhost:5000/record-counts
   ```
   y verás el conteo y ya estaría todo listo para continuar.
