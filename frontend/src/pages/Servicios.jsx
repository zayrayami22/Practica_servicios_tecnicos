import { useEffect, useState } from "react";
import {
  obtenerServicios,
  obtenerClientesCatalogo,
  obtenerTecnicosCatalogo,
  crearServicio,
  actualizarServicio,
  eliminarServicio
} from "../services/api";

function Servicios() {
  const [servicios, setServicios] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [editando, setEditando] = useState(null);
  const [cargando, setCargando] = useState(false);

  const [formulario, setFormulario] = useState({
    cliente_id: "",
    tecnico_id: "",
    descripcion: "",
    estado: "Pendiente",
    fecha: ""
  });

  const cargarDatos = async () => {
    try {
      const [rServicios, rClientes, rTecnicos] = await Promise.all([
        obtenerServicios(),
        obtenerClientesCatalogo(),
        obtenerTecnicosCatalogo()
      ]);

      if (!rServicios.ok || !rClientes.ok || !rTecnicos.ok) {
        setMensaje("No se pudieron cargar los datos.");
        return;
      }

      setServicios(rServicios.datos.servicios || []);
      setClientes(rClientes.datos.clientes || []);
      setTecnicos(rTecnicos.datos.tecnicos || []);
    } catch {
      setMensaje("No fue posible conectar con el servidor.");
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario((anterior) => ({
      ...anterior,
      [name]: value
    }));
  };

  const limpiarFormulario = () => {
    setFormulario({
      cliente_id: "",
      tecnico_id: "",
      descripcion: "",
      estado: "Pendiente",
      fecha: ""
    });
    setEditando(null);
  };

  const guardarServicio = async (e) => {
    e.preventDefault();

    if (
      !formulario.cliente_id ||
      !formulario.tecnico_id ||
      !formulario.descripcion.trim() ||
      !formulario.estado ||
      !formulario.fecha
    ) {
      setMensaje("Completa todos los campos obligatorios.");
      return;
    }

    setCargando(true);

    try {
      const servicio = {
        ...formulario,
        descripcion: formulario.descripcion.trim(),
        cliente_id: Number(formulario.cliente_id),
        tecnico_id: Number(formulario.tecnico_id)
      };

      const respuesta = editando
        ? await actualizarServicio(editando, servicio)
        : await crearServicio(servicio);

      if (!respuesta.ok) {
        setMensaje(
          respuesta.datos?.mensaje ||
          respuesta.datos?.message ||
          "No fue posible guardar el servicio."
        );
        return;
      }

      setMensaje(
        editando
          ? "Servicio actualizado correctamente."
          : "Servicio registrado correctamente."
      );

      limpiarFormulario();
      await cargarDatos();
    } catch {
      setMensaje("No fue posible conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  };

  const prepararEdicion = (servicio) => {
    setEditando(servicio.id);

    setFormulario({
      cliente_id: String(servicio.cliente_id ?? ""),
      tecnico_id: String(servicio.tecnico_id ?? ""),
      descripcion: servicio.descripcion || "",
      estado: servicio.estado || "Pendiente",
      fecha: String(servicio.fecha || "").slice(0, 10)
    });

    setMensaje("Editando el servicio seleccionado.");
  };

  const borrarServicio = async (id) => {
    if (!window.confirm("¿Deseas eliminar este servicio?")) {
      return;
    }

    setCargando(true);

    try {
      const respuesta = await eliminarServicio(id);

      if (!respuesta.ok) {
        setMensaje(
          respuesta.datos?.mensaje ||
          respuesta.datos?.message ||
          "No fue posible eliminar el servicio."
        );
        return;
      }

      if (editando === id) {
        limpiarFormulario();
      }

      setMensaje("Servicio eliminado correctamente.");
      await cargarDatos();
    } catch {
      setMensaje("No fue posible conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="dashboard">
      <h1>Módulo de Servicios</h1>
      <p>Registra, consulta, edita y elimina servicios.</p>

      <form onSubmit={guardarServicio}>
        <div>
          <label htmlFor="cliente_id">Cliente</label>
          <br />
          <select
            id="cliente_id"
            name="cliente_id"
            value={formulario.cliente_id}
            onChange={manejarCambio}
            required
            disabled={cargando}
          >
            <option value="">Selecciona un cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="tecnico_id">Técnico</label>
          <br />
          <select
            id="tecnico_id"
            name="tecnico_id"
            value={formulario.tecnico_id}
            onChange={manejarCambio}
            required
            disabled={cargando}
          >
            <option value="">Selecciona un técnico</option>
            {tecnicos.map((tecnico) => (
              <option key={tecnico.id} value={tecnico.id}>
                {tecnico.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="descripcion">Descripción</label>
          <br />
          <input
            id="descripcion"
            name="descripcion"
            type="text"
            value={formulario.descripcion}
            onChange={manejarCambio}
            maxLength={255}
            placeholder="Describe el servicio"
            required
            disabled={cargando}
          />
        </div>

        <div>
          <label htmlFor="estado">Estado</label>
          <br />
          <select
            id="estado"
            name="estado"
            value={formulario.estado}
            onChange={manejarCambio}
            required
            disabled={cargando}
          >
            <option value="Pendiente">Pendiente</option>
            <option value="En proceso">En proceso</option>
            <option value="Completado">Completado</option>
          </select>
        </div>

        <div>
          <label htmlFor="fecha">Fecha</label>
          <br />
          <input
            id="fecha"
            name="fecha"
            type="date"
            value={formulario.fecha}
            onChange={manejarCambio}
            required
            disabled={cargando}
          />
        </div>

        <br />

        <button type="submit" disabled={cargando}>
          {cargando
            ? "Procesando..."
            : editando
              ? "Guardar cambios"
              : "Registrar servicio"}
        </button>

        {editando !== null && (
          <button
            type="button"
            onClick={limpiarFormulario}
            disabled={cargando}
          >
            Cancelar
          </button>
        )}
      </form>

      {mensaje && <p role="status">{mensaje}</p>}

      <h2>Servicios registrados</h2>

      <table>
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
                  disabled={cargando}
                >
                  Editar
                </button>{" "}
                <button
                  type="button"
                  onClick={() => borrarServicio(servicio.id)}
                  disabled={cargando}
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
  );
}

export default Servicios;