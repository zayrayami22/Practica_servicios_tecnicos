
import os
import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv

# Cargar el archivo .env ubicado en la carpeta backend
RUTA_ENV = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
    ".env"
)
load_dotenv(RUTA_ENV)

HOST = os.getenv("DB_HOST", "localhost")
USER = os.getenv("DB_USER", "root")
PASSWORD = os.getenv("DB_PASSWORD", "")
DATABASE = os.getenv("DB_NAME", "tecnico")


def conectar():
    try:
        conexion = mysql.connector.connect(
            host=HOST,
            user=USER,
            password=PASSWORD,
            database=DATABASE,
            use_pure=True
        )

        if conexion.is_connected():
            print("Conexión exitosa a la base de datos")
            return conexion

        conexion.close()

    except Error:
        print(
            "Error al conectar con la base de datos. "
            "Revisa la configuración."
        )

    return None
