import os
import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv

RUTA_ENV = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
    ".env"
)
load_dotenv(RUTA_ENV)

HOST = os.getenv("DB_HOST", "localhost")
USER = os.getenv("DB_USER", "root")
PASSWORD = os.getenv("DB_PASSWORD", "")
DATABASE = os.getenv("DB_NAME", "tecnico")
PORT = int(os.getenv("DB_PORT", "3306"))

RUTA_CA = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
    "isrgrootx1.pem"
)


def conectar():
    try:
        conexion = mysql.connector.connect(
            host=HOST,
            port=PORT,
            user=USER,
            password=PASSWORD,
            database=DATABASE,
            ssl_ca=RUTA_CA,
            ssl_verify_cert=True,
            ssl_verify_identity=True,
            use_pure=True
        )

        if conexion.is_connected():
            print("Conexión exitosa a la base de datos")
            return conexion

        conexion.close()

    except Error as e:
        print("Error al conectar con la base de datos:", e)

    return None