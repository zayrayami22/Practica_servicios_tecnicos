
import { useEffect, useState } from "react";
import {
  obtenerServicios,
  obtenerClientesCatalogo,
  obtenerTecnicosCatalogo,
  crearServicio,
  actualizarServicio,
  eliminarServicio
} from "../services/api";

export default function Servicios() {
  const [servicios, setServicios] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [editando, setEditando] = useState(null);

  const [formulario, setFormulario] = useState({
    cliente_id: "",
    tecnico_id: "",
    descripcion: "",
    estado: "Pendiente",
    fecha: ""
  });

  async function cargarDatos() {
    try {
      const [rServicios, rClientes, rTecnicos] = await Promise.all([
        obtenerServicios(),
        obtenerClientesCatalogo(),
        obtenerTecnicosCatalogo()
      ]);

      if (!rServicios.ok || !rClientes.ok || !rTecnicos.ok) {
        setMensaje("No se pudieron cargar todos los datos.");
        return;
      }

      setServicios(rServicios.datos.servicios || []);
      setClientes(rClientes.datos.clientes || []);
      setTecnicos(rTecnicos.datos.tecnicos || []);
    } catch (error) {
      setMensaje("Error al conectar con el servidor.");
    }
  }

  useEffect(() => {
    cargarDatos();
  }, []);

  function manejarCambio(e) {
    const { name, value } = e.target;

    setFormulario({
      ...formulario,
      [name]: value
    });
  }

  function limpiarFormulario() {
    setFormulario({
      cliente_id: "",
      tecnico_id: "",
      descripcion: "",
      estado: "Pendiente",
      fecha: ""
    });
    setEditando(null);
  }

  async function guardarServicio(e) {
    e.preventDefault();
    setMensaje("");

    const servicio = {
      ...formulario,
      cliente_id: Number(formulario.cliente_id),
      tecnico_id: Number(formulario.tecnico_id)
    };

    try {
      const respuesta = editando
        ? await actualizarServicio(editando, servicio)
        : await crearServicio(servicio);

      setMensaje(
        respuesta.datos.mensaje ||
        respuesta.datos.message ||
        (respuesta.ok ? "Operación realizada correctamente." : "No se pudo guardar el servicio.")
      );

      if (respuesta.ok) {
        limpiarFormulario();
        await cargarDatos();
      }
    } catch (error) {
      setMensaje("Error al conectar con el servidor.");
    }
  }

  function prepararEdicion(servicio) {
    setEditando(servicio.id);
    setFormulario({
      cliente_id: String(servicio.cliente_id),
      tecnico_id: String(servicio.tecnico_id),
      descripcion: servicio.descripcion,
      estado: servicio.estado,
      fecha: String(servicio.fecha).slice(0, 10)
    });
    setMensaje("");
  }

  async function borrarServicio(id) {
    if (!window.confirm("¿Seguro que deseas eliminar este servicio?")) {
      return;
    }

    try {
      const respuesta = await eliminarServicio(id);

      setMensaje(
        respuesta.datos.mensaje ||
        respuesta.datos.message ||
        (respuesta.ok ? "Servicio eliminado." : "No se pudo eliminar el servicio.")
      );

      if (respuesta.ok) {
        await cargarDatos();
        if (editando === id) {
          limpiarFormulario();
        }
      }
    } catch (error) {
      setMensaje("Error al conectar con el servidor.");
    }
  }

  return (
    <main style={{ padding: "24px", maxWidth: "1100px", margin: "auto" }}>
      <h1>Módulo de Servicios</h1>
      <p>Registra y administra los servicios técnicos.</p>

      {mensaje && (
        <p role="status" style={{ padding: "10px", background: "#f1f1f1" }}>
          {mensaje}
        </p>
      )}

      <form onSubmit={guardarServicio}>
        <label htmlFor="cliente_id">Cliente</label>
        <select
          id="cliente_id"
          name="cliente_id"
          value={formulario.cliente_id}
          onChange={manejarCambio}
          required
        >
          <option value="">Selecciona un cliente</option>
          {clientes.map((cliente) => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.nombre}
            </option>
          ))}
        </select>

        <br /><br />

        <label htmlFor="tecnico_id">Técnico</label>
        <select
          id="tecnico_id"
          name="tecnico_id"
          value={formulario.tecnico_id}
          onChange={manejarCambio}
          required
        >
          <option value="">Selecciona un técnico</option>
          {tecnicos.map((tecnico) => (
            <option key={tecnico.id} value={tecnico.id}>
              {tecnico.nombre}
            </option>
          ))}
        </select>

        <br /><br />

        <label htmlFor="descripcion">Descripción</label>
        <input
          id="descripcion"
          name="descripcion"
          value={formulario.descripcion}
          onChange={manejarCambio}
          maxLength={255}
          required
          placeholder="Describe el servicio"
        />

        <br /><br />

        <label htmlFor="estado">Estado</label>
        <select
          id="estado"
          name="estado"
          value={formulario.estado}
          onChange={manejarCambio}
          required
        >
          <option value="Pendiente">Pendiente</option>
          <option value="En proceso">En proceso</option>
          <option value="Completado">Completado</option>
        </select>

        <br /><br />

        <label htmlFor="fecha">Fecha</label>
        <input
          id="fecha"
          name="fecha"
          type="date"
          value={formulario.fecha}
          onChange={manejarCambio}
          required
        />

        <br /><br />

        <button type="submit">
          {editando ? "Actualizar servicio" : "Registrar servicio"}
        </button>

        {editando && (
          <button type="button" onClick={limpiarFormulario}>
            Cancelar edición
          </button>
        )}
      </form>

      <hr />

      <h2>Servicios registrados</h2>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Técnico</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {servicios.map((servicio) => (
              <tr key={servicio.id}>
                <td>{servicio.id}</td>
                <td>{servicio.cliente_nombre}</td>
                <td>{servicio.tecnico_nombre}</td>
                <td>{servicio.descripcion}</td>
                <td>{servicio.estado}</td>
                <td>{String(servicio.fecha).slice(0, 10)}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => prepararEdicion(servicio)}
                  >
                    Editar
                  </button>{" "}
                  <button
                    type="button"
                    onClick={() => borrarServicio(servicio.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}

            {servicios.length === 0 && (
              <tr>
                <td colSpan="7">No hay servicios registrados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
