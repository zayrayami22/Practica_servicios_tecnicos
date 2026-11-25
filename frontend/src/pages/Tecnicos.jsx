
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
      const eraEdicion = editandoId !== null;
      const datos = {
        nombre: nombre.trim(),
        especialidad: especialidad.trim()
      };

      const r = eraEdicion
        ? await actualizarTecnico(editandoId, datos)
        : await crearTecnico(datos);

      if (r.ok && r.datos.success) {
        setNombre("");
        setEspecialidad("");
        setEditandoId(null);
        setMensaje(
          r.datos.message ||
          (eraEdicion ? "Técnico actualizado correctamente" : "Técnico registrado correctamente")
        );
        await cargarTecnicos();
      } else {
        setMensaje(r.datos.message || "No se pudo guardar el técnico");
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
    if (!window.confirm("¿Deseas eliminar este técnico?")) return;

    try {
      const r = await eliminarTecnico(id);

      if (r.ok && r.datos.success) {
        if (editandoId === id) cancelarEdicion();
        setMensaje(r.datos.message || "Técnico eliminado correctamente");
        await cargarTecnicos();
      } else {
        setMensaje(r.datos.message || "No se pudo eliminar el técnico");
      }
    } catch {
      setMensaje("Error de conexión con Flask");
    }
  };

  return (
    <main style={{ padding: "20px", maxWidth: "900px" }}>
      <h1 style={{ margin: "0 0 16px" }}>Técnicos</h1>

      <form
        onSubmit={guardar}
        style={{
          display: "flex",
          gap: "10px",
          alignItems: "end",
          marginBottom: "12px",
          flexWrap: "wrap"
        }}
      >
        <div style={{ flex: "1", minWidth: "180px" }}>
          <label htmlFor="nombre-tecnico">Nombre</label>
          <input
            id="nombre-tecnico"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre del técnico"
            required
            style={{ display: "block", boxSizing: "border-box", width: "100%", padding: "9px", marginTop: "4px" }}
          />
        </div>

        <div style={{ flex: "1", minWidth: "180px" }}>
          <label htmlFor="especialidad-tecnico">Especialidad</label>
          <input
            id="especialidad-tecnico"
            type="text"
            value={especialidad}
            onChange={(e) => setEspecialidad(e.target.value)}
            placeholder="Ej. Computadoras"
            required
            style={{ display: "block", boxSizing: "border-box", width: "100%", padding: "9px", marginTop: "4px" }}
          />
        </div>

        <button type="submit" disabled={cargando} style={{ padding: "9px 14px" }}>
          {cargando ? "Guardando..." : editandoId !== null ? "Guardar" : "Agregar"}
        </button>

        {editandoId !== null && (
          <button type="button" onClick={cancelarEdicion} style={{ padding: "9px 14px" }}>
            Cancelar
          </button>
        )}
      </form>

      {mensaje && (
        <p role="status" style={{ margin: "8px 0 14px" }}>
          {mensaje}
        </p>
      )}

      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
        <thead>
          <tr>
            <th style={estiloCelda}>ID</th>
            <th style={estiloCelda}>Nombre</th>
            <th style={estiloCelda}>Especialidad</th>
            <th style={estiloCelda}>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {tecnicos.map((tecnico) => (
            <tr key={tecnico.id}>
              <td style={estiloCelda}>{tecnico.id}</td>
              <td style={estiloCelda}>{tecnico.nombre}</td>
              <td style={estiloCelda}>{tecnico.especialidad}</td>
              <td style={estiloCelda}>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <button type="button" onClick={() => editar(tecnico)}>
                    Editar
                  </button>
                  <button type="button" onClick={() => eliminar(tecnico.id)}>
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {tecnicos.length === 0 && (
            <tr>
              <td colSpan="4" style={estiloCelda}>
                No hay técnicos registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  );
}

const estiloCelda = {
  padding: "10px 8px",
  borderBottom: "1px solid #dddddd"
};

export default Tecnicos;
