
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

      const respuesta = editando !== null
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
        editando !== null
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

  const estiloCampo = {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    flex: "1",
    minWidth: "150px"
  };

  const estiloEntrada = {
    padding: "9px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "14px",
    width: "100%",
    boxSizing: "border-box"
  };

  const estiloBoton = {
    padding: "9px 12px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    background: "#f5f5f5",
    cursor: "pointer",
    fontSize: "14px"
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1100px" }}>
      <h1 style={{ marginTop: 0, marginBottom: "8px" }}>
        Servicios
      </h1>

      <p style={{ marginTop: 0, marginBottom: "16px" }}>
        Registra, consulta, edita y elimina servicios.
      </p>

      <form
        onSubmit={guardarServicio}
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "end",
          gap: "10px",
          marginBottom: "12px"
        }}
      >
        <div style={estiloCampo}>
          <label htmlFor="cliente_id">Cliente</label>
          <select
            id="cliente_id"
            name="cliente_id"
            value={formulario.cliente_id}
            onChange={manejarCambio}
            required
            disabled={cargando}
            style={estiloEntrada}
          >
            <option value="">Seleccionar cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nombre}
              </option>
            ))}
          </select>
        </div>

        <div style={estiloCampo}>
          <label htmlFor="tecnico_id">Técnico</label>
          <select
            id="tecnico_id"
            name="tecnico_id"
            value={formulario.tecnico_id}
            onChange={manejarCambio}
            required
            disabled={cargando}
            style={estiloEntrada}
          >
            <option value="">Seleccionar técnico</option>
            {tecnicos.map((tecnico) => (
              <option key={tecnico.id} value={tecnico.id}>
                {tecnico.nombre}
              </option>
            ))}
          </select>
        </div>

        <div style={{ ...estiloCampo, minWidth: "190px" }}>
          <label htmlFor="descripcion">Descripción</label>
          <input
            id="descripcion"
            name="descripcion"
            type="text"
            value={formulario.descripcion}
            onChange={manejarCambio}
            maxLength={255}
            placeholder="Descripción del servicio"
            required
            disabled={cargando}
            style={estiloEntrada}
          />
        </div>

        <div style={{ ...estiloCampo, minWidth: "130px", flex: "0.7" }}>
          <label htmlFor="estado">Estado</label>
          <select
            id="estado"
            name="estado"
            value={formulario.estado}
            onChange={manejarCambio}
            required
            disabled={cargando}
            style={estiloEntrada}
          >
            <option value="Pendiente">Pendiente</option>
            <option value="En proceso">En proceso</option>
            <option value="Completado">Completado</option>
          </select>
        </div>

        <div style={{ ...estiloCampo, minWidth: "145px", flex: "0.7" }}>
          <label htmlFor="fecha">Fecha</label>
          <input
            id="fecha"
            name="fecha"
            type="date"
            value={formulario.fecha}
            onChange={manejarCambio}
            required
            disabled={cargando}
            style={estiloEntrada}
          />
        </div>

        <button type="submit" disabled={cargando} style={estiloBoton}>
          {cargando
            ? "Procesando..."
            : editando !== null
              ? "Guardar cambios"
              : "Registrar"}
        </button>

        {editando !== null && (
          <button
            type="button"
            onClick={limpiarFormulario}
            disabled={cargando}
            style={estiloBoton}
          >
            Cancelar
          </button>
        )}
      </form>

      {mensaje && (
        <p role="status" style={{ margin: "10px 0" }}>
          {mensaje}
        </p>
      )}

      <h2 style={{ marginTop: "20px", marginBottom: "10px" }}>
        Lista de servicios
      </h2>

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left"
          }}
        >
          <thead>
            <tr>
              {["ID", "Cliente", "Técnico", "Descripción", "Estado", "Fecha", "Acciones"].map((titulo) => (
                <th
                  key={titulo}
                  style={{
                    padding: "10px 8px",
                    borderBottom: "2px solid #ccc"
                  }}
                >
                  {titulo}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {servicios.map((servicio) => (
              <tr key={servicio.id}>
                {[
                  servicio.id,
                  servicio.cliente_nombre,
                  servicio.tecnico_nombre,
                  servicio.descripcion,
                  servicio.estado,
                  String(servicio.fecha || "").slice(0, 10)
                ].map((dato, indice) => (
                  <td
                    key={indice}
                    style={{
                      padding: "10px 8px",
                      borderBottom: "1px solid #ddd"
                    }}
                  >
                    {dato}
                  </td>
                ))}

                <td style={{ padding: "10px 8px", borderBottom: "1px solid #ddd" }}>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    <button
                      type="button"
                      onClick={() => prepararEdicion(servicio)}
                      disabled={cargando}
                      style={estiloBoton}
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() => borrarServicio(servicio.id)}
                      disabled={cargando}
                      style={estiloBoton}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {servicios.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  style={{ padding: "10px 8px", borderBottom: "1px solid #ddd" }}
                >
                  No hay servicios registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Servicios;