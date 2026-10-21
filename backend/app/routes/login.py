
from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
from app.config.conexion import conectar

login_bp = Blueprint("login", __name__)


@login_bp.route("/api/login", methods=["POST"])
def login():
    datos = request.get_json(silent=True)

    if not isinstance(datos, dict):
        return jsonify({
            "success": False,
            "message": "El cuerpo de la petición debe ser un objeto JSON."
        }), 400

    username = datos.get("username")
    password = datos.get("password")

    if not isinstance(username, str) or not username.strip():
        return jsonify({
            "success": False,
            "message": "El usuario es obligatorio."
        }), 400

    if not isinstance(password, str) or not password:
        return jsonify({
            "success": False,
            "message": "La contraseña es obligatoria."
        }), 400

    conexion = conectar()

    if conexion is None:
        return jsonify({
            "success": False,
            "message": "No se pudo conectar con la base de datos."
        }), 500

    cursor = None

    try:
        cursor = conexion.cursor()

        consulta = """
            SELECT username, password
            FROM usuario
            WHERE username = %s
        """

        cursor.execute(consulta, (username.strip(),))
        usuario = cursor.fetchone()

        if usuario and check_password_hash(usuario[1], password):
            return jsonify({
                "success": True,
                "message": "Inicio de sesión correcto",
                "username": usuario[0]
            }), 200

        return jsonify({
            "success": False,
            "message": "Usuario o contraseña incorrectos."
        }), 401

    except Exception:
        app_logger = __import__("logging").getLogger(__name__)
        app_logger.exception("Error interno durante el inicio de sesión")

        return jsonify({
            "success": False,
            "message": "Ocurrió un error interno. Intenta nuevamente."
        }), 500

    finally:
        if cursor:
            cursor.close()

        if conexion:
            conexion.close()
