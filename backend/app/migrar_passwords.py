
from werkzeug.security import generate_password_hash
from app.config.conexion import conectar


def migrar_passwords():
    conexion = conectar()

    if conexion is None:
        print("No se pudo conectar a la base de datos.")
        return

    cursor = None

    try:
        cursor = conexion.cursor()
        cursor.execute("SELECT id, password FROM usuario")
        usuarios = cursor.fetchall()

        actualizados = 0

        for usuario_id, password_actual in usuarios:
            # Evitar volver a convertir un hash existente.
            if password_actual.startswith(("scrypt:", "pbkdf2:")):
                continue

            password_hash = generate_password_hash(password_actual)

            cursor.execute(
                "UPDATE usuario SET password = %s WHERE id = %s",
                (password_hash, usuario_id)
            )

            actualizados += cursor.rowcount

        conexion.commit()
        print("Migración terminada.")
        print("Contraseñas convertidas:", actualizados)

    except Exception:
        conexion.rollback()
        print("La migración falló. Los cambios se revirtieron.")
        raise

    finally:
        if cursor:
            cursor.close()

        conexion.close()


if __name__ == "__main__":
    migrar_passwords()
