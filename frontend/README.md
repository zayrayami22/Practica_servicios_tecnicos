# Sistema de Servicios Técnicos

## Descripción del proyecto

Aplicación web para administrar los servicios técnicos, los clientes y los técnicos de un negocio. Permite iniciar sesión y realizar operaciones de consulta, registro, edición y eliminación de información.

## Tecnologías utilizadas

- **Frontend:** React, JavaScript y Vite.
- **Backend:** Python y Flask.
- **Base de datos:** MariaDB/MySQL.
- **Pruebas de API:** REST Client para Visual Studio Code.
- **Control de versiones:** Git y GitHub.

## Requisitos previos

- Python 3.
- Node.js y npm.
- XAMPP con MariaDB/MySQL.
- Visual Studio Code.
- Extensión REST Client para realizar pruebas de API.

## Módulos del sistema

- **Inicio de sesión:** verifica las credenciales del usuario.
- **Dashboard:** permite navegar entre los módulos.
- **Clientes:** administra los registros de clientes.
- **Técnicos:** administra los técnicos y sus especialidades.
- **Servicios:** registra, consulta, edita y elimina servicios, relacionándolos con un cliente y un técnico.

## Configuración de la base de datos

1. Iniciar MySQL/MariaDB desde XAMPP.
2. Crear la base de datos llamada `tecnico`.
3. Crear las tablas necesarias: `usuario`, `cliente`, `tecnico` y `servicio`, incluyendo las relaciones entre servicios, clientes y técnicos.
4. Configurar las variables de conexión en el archivo local `backend/.env`.

Ejemplo de variables de entorno:

```env
DB_HOST=localhost
DB_USER=usuario_local
DB_PASSWORD=pon_tu_contraseña_local
DB_NAME=tecnico
```

Los valores del ejemplo deben sustituirse por la configuración local correspondiente. No publicar contraseñas reales en GitHub.

## Instalación y ejecución

### 1. Backend

Abrir una terminal en la carpeta `backend`:

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m app.main
```

El backend se ejecuta localmente en:

`http://127.0.0.1:5000`

### 2. Frontend

Abrir otra terminal en la carpeta `frontend`:

```powershell
cd frontend
npm install
npm run dev
```

Abrir en el navegador la dirección que muestre Vite, normalmente:

`http://localhost:5173/`

### 3. Conexión a la base de datos

Para comprobar la conexión, desde la carpeta `backend`, con el entorno virtual activado, ejecutar:

```powershell
python -m app.probar_conexion
```

## Pruebas de API

El archivo `pruebas_api.http`, ubicado en la carpeta principal, contiene peticiones para consultar servicios, clientes y técnicos, así como registrar un servicio de prueba.

Las pruebas deben incluir:

- GET para consultar información.
- POST para registrar información.
- PUT para actualizar un registro.
- DELETE para eliminar un registro de prueba.
- Validaciones de campos obligatorios y manejo de errores.

Los códigos HTTP y las respuestas deben verificarse durante las pruebas.

## Seguridad

- Mantener las credenciales y variables privadas en archivos locales `.env`.
- Excluir los archivos `.env` del repositorio mediante `.gitignore`.
- Utilizar consultas SQL parametrizadas.
- Guardar las contraseñas mediante funciones de hash seguro.
- Validar los datos tanto en el frontend como en el backend.
- Evitar mostrar detalles internos de errores al usuario.
- Desactivar el modo de depuración y configurar CORS adecuadamente antes de publicar la aplicación.

## Publicación

Antes de desplegar la aplicación, configurar las variables de entorno del servidor, la URL pública del backend, los permisos de la base de datos, CORS y HTTPS. Las direcciones locales de desarrollo deben sustituirse por las direcciones del entorno de publicación.

## Repositorio

GitHub: https://github.com/zayrayami22/Practica_servicios_tecnicos

## Autora

Proyecto académico desarrollado como práctica de integración de React, Flask y MariaDB/MySQL.
