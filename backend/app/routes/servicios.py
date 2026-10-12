from flask import Blueprint, request, jsonify
from app.config.conexion import conectar

servicios_bp = Blueprint("servicios", __name__)


# GET: Consultar servicios con nombres de clientes y técnicos
@servicios_bp.route("/api/servicios", methods=["GET"])
def obtener_servicios():
    conexion = None
    cursor = None

    try:
        conexion = conectar()
        cursor = conexion.cursor(dictionary=True)

        sql = """
            SELECT
                s.id,
                s.cliente_id,
                c.nombre AS cliente_nombre,
                s.tecnico_id,
                t.nombre AS tecnico_nombre,
                s.descripcion,
                s.estado,
                s.fecha
            FROM servicio s
            INNER JOIN cliente c ON s.cliente_id = c.id
            INNER JOIN tecnico t ON s.tecnico_id = t.id
            ORDER BY s.id DESC
        """

        cursor.execute(sql)
        servicios = cursor.fetchall()

        for servicio in servicios:
            if servicio["fecha"] is not None:
                servicio["fecha"] = servicio["fecha"].isoformat()

        return jsonify({
            "success": True,
            "servicios": servicios
        }), 200

    except Exception as e:
        print("Error al consultar servicios:", e)
        return jsonify({
            "success": False,
            "mensaje": "Error al consultar servicios"
        }), 500

    finally:
        if cursor:
            cursor.close()
        if conexion:
            conexion.close()


# POST: Registrar un servicio
@servicios_bp.route("/api/servicios", methods=["POST"])
def crear_servicio():
    conexion = None
    cursor = None

    datos = request.get_json(silent=True)

    if not datos:
        return jsonify({
            "success": False,
            "mensaje": "Debes enviar los datos en formato JSON"
        }), 400

    cliente_id = datos.get("cliente_id")
    tecnico_id = datos.get("tecnico_id")
    descripcion = datos.get("descripcion")
    estado = datos.get("estado", "Pendiente")
    fecha = datos.get("fecha")

    if not cliente_id or not tecnico_id or not descripcion or not fecha:
        return jsonify({
            "success": False,
            "mensaje": "cliente_id, tecnico_id, descripcion y fecha son obligatorios"
        }), 400

    try:
        conexion = conectar()
        cursor = conexion.cursor()

        sql = """
            INSERT INTO servicio
                (cliente_id, tecnico_id, descripcion, estado, fecha)
            VALUES (%s, %s, %s, %s, %s)
        """

        cursor.execute(
            sql,
            (cliente_id, tecnico_id, descripcion, estado, fecha)
        )
        conexion.commit()

        nuevo_id = cursor.lastrowid

        return jsonify({
            "success": True,
            "mensaje": "Servicio registrado correctamente",
            "id": nuevo_id
        }), 201

    except Exception as e:
        if conexion:
            conexion.rollback()
        print("Error al registrar servicio:", e)
        return jsonify({
            "success": False,
            "mensaje": "No se pudo registrar el servicio. Verifica los IDs y la fecha."
        }), 400

    finally:
        if cursor:
            cursor.close()
        if conexion:
            conexion.close()


# PUT: Actualizar un servicio
@servicios_bp.route("/api/servicios/<int:servicio_id>", methods=["PUT"])
def actualizar_servicio(servicio_id):
    conexion = None
    cursor = None

    datos = request.get_json(silent=True)

    if not datos:
        return jsonify({
            "success": False,
            "mensaje": "Debes enviar los datos en formato JSON"
        }), 400

    cliente_id = datos.get("cliente_id")
    tecnico_id = datos.get("tecnico_id")
    descripcion = datos.get("descripcion")
    estado = datos.get("estado")
    fecha = datos.get("fecha")

    if not cliente_id or not tecnico_id or not descripcion or not estado or not fecha:
        return jsonify({
            "success": False,
            "mensaje": "Todos los campos son obligatorios"
        }), 400

    try:
        conexion = conectar()
        cursor = conexion.cursor()

        cursor.execute(
            "SELECT id FROM servicio WHERE id = %s",
            (servicio_id,)
        )

        if not cursor.fetchone():
            return jsonify({
                "success": False,
                "mensaje": "Servicio no encontrado"
            }), 404

        sql = """
            UPDATE servicio
            SET cliente_id = %s,
                tecnico_id = %s,
                descripcion = %s,
                estado = %s,
                fecha = %s
            WHERE id = %s
        """

        cursor.execute(
            sql,
            (
                cliente_id,
                tecnico_id,
                descripcion,
                estado,
                fecha,
                servicio_id
            )
        )
        conexion.commit()

        return jsonify({
            "success": True,
            "mensaje": "Servicio actualizado correctamente"
        }), 200

    except Exception as e:
        if conexion:
            conexion.rollback()
        print("Error al actualizar servicio:", e)
        return jsonify({
            "success": False,
            "mensaje": "No se pudo actualizar el servicio. Verifica los datos."
        }), 400

    finally:
        if cursor:
            cursor.close()
        if conexion:
            conexion.close()


# DELETE: Eliminar un servicio
@servicios_bp.route("/api/servicios/<int:servicio_id>", methods=["DELETE"])
def eliminar_servicio(servicio_id):
    conexion = None
    cursor = None

    try:
        conexion = conectar()
        cursor = conexion.cursor()

        cursor.execute(
            "SELECT id FROM servicio WHERE id = %s",
            (servicio_id,)
        )

        if not cursor.fetchone():
            return jsonify({
                "success": False,
                "mensaje": "Servicio no encontrado"
            }), 404

        cursor.execute(
            "DELETE FROM servicio WHERE id = %s",
            (servicio_id,)
        )
        conexion.commit()

        return jsonify({
            "success": True,
            "mensaje": "Servicio eliminado correctamente"
        }), 200

    except Exception as e:
        if conexion:
            conexion.rollback()
        print("Error al eliminar servicio:", e)
        return jsonify({
            "success": False,
            "mensaje": "No se pudo eliminar el servicio"
        }), 400

    finally:
        if cursor:
            cursor.close()
        if conexion:
            conexion.close()