
import { useEffect, useState } from "react";
import {
  obtenerTecnicos,
  crearTecnico,
  actualizarTecnico,
  eliminarTecnico
} from "../services/api";

function Tecnicos() {
  const [tecnicos, setTecnicos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const cargarTecnicos = async () => {
    try {
      const r = await obtenerTecnicos();

      if (r.ok && r.datos.success) {
        setTecnicos(r.datos.tecnicos);
      } else {
        setMensaje(r.datos.message || "Error al cargar técnicos");
      }
    } catch {
      setMensaje("No se pudo conectar con el servidor");
    }
  };

  useEffect(() => {
    cargarTecnicos();
  }, []);

  const guardar = async (e) => {
    e.preventDefault();

    if (!nombre.trim() || !especialidad.trim()) {
      setMensaje("Todos los campos son obligatorios");
      return;
    }

    setCargando(true);

    try {
      const datos = {
        nombre: nombre.trim(),
        especialidad: especialidad.trim()
      };

      const r = editandoId
        ? await actualizarTecnico(editandoId, datos)
        : await crearTecnico(datos);

      setMensaje(
        r.datos.message ||
        (r.ok ? "Operación realizada" : "No se pudo guardar")
      );

      if (r.ok) {
        setNombre("");
        setEspecialidad("");
        setEditandoId(null);
        await cargarTecnicos();
      }
    } catch {
      setMensaje("Error de conexión con Flask");
    } finally {
      setCargando(false);
    }
  };

  const editar = (tecnico) => {
    setEditandoId(tecnico.id);
    setNombre(tecnico.nombre);
    setEspecialidad(tecnico.especialidad);
    setMensaje("Editando técnico ID " + tecnico.id);
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setNombre("");
    setEspecialidad("");
    setMensaje("");
  };

  const eliminar = async (id) => {
    if (!window.confirm("¿Deseas eliminar este técnico?")) {
      return;
    }

    try {
      const r = await eliminarTecnico(id);

      setMensaje(
        r.datos.message ||
        (r.ok ? "Técnico eliminado" : "No se pudo eliminar")
      );

      if (r.ok) {
        if (editandoId === id) {
          cancelarEdicion();
        }

        await cargarTecnicos();
      }
    } catch {
      setMensaje("Error de conexión con Flask");
    }
  };

  return (
    <div className="dashboard">
      <h1>Módulo de Técnicos</h1>
      <p>Registra, consulta, edita y elimina técnicos.</p>

      <form onSubmit={guardar}>
        <div>
          <label htmlFor="nombre-tecnico">Nombre</label>
          <input
            id="nombre-tecnico"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre del técnico"
            required
          />
        </div>

        <div>
          <label htmlFor="especialidad-tecnico">Especialidad</label>
          <input
            id="especialidad-tecnico"
            type="text"
            value={especialidad}
            onChange={(e) => setEspecialidad(e.target.value)}
            placeholder="Ej. Computadoras"
            required
          />
        </div>

        <button type="submit" disabled={cargando}>
          {cargando
            ? "Guardando..."
            : editandoId
              ? "Actualizar técnico"
              : "Registrar técnico"}
        </button>

        {editandoId !== null && (
          <button type="button" onClick={cancelarEdicion}>
            Cancelar
          </button>
        )}
      </form>

      {mensaje && <p role="status">{mensaje}</p>}

      <h2>Lista de técnicos</h2>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Especialidad</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {tecnicos.map((tecnico) => (
            <tr key={tecnico.id}>
              <td>{tecnico.id}</td>
              <td>{tecnico.nombre}</td>
              <td>{tecnico.especialidad}</td>
              <td>
                <button
                  type="button"
                  onClick={() => editar(tecnico)}
                >
                  Editar
                </button>

                <button
                  type="button"
                  onClick={() => eliminar(tecnico.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}

          {tecnicos.length === 0 && (
            <tr>
              <td colSpan="4">No hay técnicos registrados.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Tecnicos;