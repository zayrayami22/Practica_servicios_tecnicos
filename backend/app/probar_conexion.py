
from app.config.conexion import conectar


conexion = conectar()

if conexion is not None:
    print("CONEXIÓN EXITOSA")
    print("Base de datos:", conexion.database)
    conexion.close()
else:
    print("NO SE PUDO CONECTAR A LA BASE DE DATOS")