# Sistema de Servicios Técnicos

## Descripción

Aplicación web para administrar clientes, técnicos y servicios. Permite iniciar sesión y realizar operaciones de consulta, registro, edición y eliminación de información.

## Tecnologías utilizadas

- **Frontend:** React, JavaScript y Vite.
- **Backend:** Python y Flask.
- **Base de datos:** MariaDB/MySQL.
- **Pruebas de API:** REST Client para Visual Studio Code.
- **Control de versiones:** Git y GitHub.

## Requisitos

- Python 3.
- Node.js y npm.
- XAMPP con MariaDB/MySQL.
- Visual Studio Code.
- Extensión REST Client para probar la API.

## Módulos

- **Inicio de sesión:** verifica las credenciales.
- **Dashboard:** permite navegar entre los módulos.
- **Clientes:** administra clientes.
- **Técnicos:** administra técnicos y especialidades.
- **Servicios:** registra, consulta, edita y elimina servicios relacionados con un cliente y un técnico.

## Configuración de la base de datos

1. Iniciar MariaDB/MySQL desde XAMPP.
2. Crear la base de datos `tecnico`.
3. Crear las tablas `usuario`, `cliente`, `tecnico` y `servicio`, incluyendo las relaciones correspondientes.
4. Configurar las variables de conexión en el archivo local `backend/.env`.

Ejemplo de configuración:

```env
DB_HOST=localhost
DB_USER=usuario_local
DB_PASSWORD=pon_tu_contraseña_local
DB_NAME=tecnico
```

Sustituir los valores de ejemplo por la configuración local. No publicar contraseñas reales en GitHub.

## Instalación y ejecución

### Backend

Desde una terminal, en la carpeta `backend`:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m app.main
```

La API estará disponible localmente en `http://127.0.0.1:5000`.

### Frontend

Desde otra terminal, en la carpeta `frontend`:

```powershell
npm install
npm run dev
```

Abrir en el navegador la dirección que muestre Vite, normalmente `http://localhost:5173/`.

### Comprobar la conexión a la base de datos

Desde la carpeta `backend`, con el entorno virtual activado:

```powershell
python -m app.probar_conexion
```

## Pruebas de API

El archivo `pruebas_api.http`, ubicado en la raíz del proyecto, contiene peticiones para consultar clientes, técnicos y servicios, y registrar un servicio de prueba.

Las pruebas deben incluir operaciones GET, POST, PUT y DELETE, además de validaciones de campos obligatorios y manejo de errores HTTP.

## Seguridad

- Mantener las credenciales en archivos locales `.env`.
- Excluir archivos privados y dependencias innecesarias mediante `.gitignore`.
- Utilizar consultas SQL parametrizadas.
- Almacenar las contraseñas mediante funciones de hash seguro.
- Validar los datos en el frontend y el backend.
- Evitar mostrar detalles internos de errores al usuario.
- Desactivar el modo de depuración y configurar CORS antes de publicar la aplicación.

## Publicación

Antes de desplegar el sistema, configurar las variables de entorno, la URL pública de la API, CORS, HTTPS y los permisos de la base de datos. Sustituir las direcciones locales por las del entorno de publicación.

## Repositorio

https://github.com/zayrayami22/Practica_servicios_tecnicos

## Autora

Proyecto académico de integración de React, Flask y MariaDB/MySQL.