
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
  const [tipoMensaje, setTipoMensaje] = useState("info");
  const [editando, setEditando] = useState(null);
  const [cargando, setCargando] = useState(false);

  const [formulario, setFormulario] = useState({
    cliente_id: "",
    tecnico_id: "",
    descripcion: "",
    estado: "Pendiente",
    fecha: ""
  });

  function mostrarMensaje(texto, tipo = "info") {
    setMensaje(texto);
    setTipoMensaje(tipo);
  }

  async function cargarDatos(mostrarError = true) {
    try {
      const [rServicios, rClientes, rTecnicos] = await Promise.all([
        obtenerServicios(),
        obtenerClientesCatalogo(),
        obtenerTecnicosCatalogo()
      ]);

      if (!rServicios.ok || !rClientes.ok || !rTecnicos.ok) {
        if (mostrarError) {
          mostrarMensaje("No se pudieron cargar los datos.", "error");
        }
        return false;
      }

      setServicios(rServicios.datos.servicios || []);
      setClientes(rClientes.datos.clientes || []);
      setTecnicos(rTecnicos.datos.tecnicos || []);

      return true;
    } catch (error) {
      console.error("Error al cargar servicios:", error);

      if (mostrarError) {
        mostrarMensaje("No fue posible conectar con el servidor.", "error");
      }

      return false;
    }
  }

  useEffect(() => {
    cargarDatos();
  }, []);

  function manejarCambio(e) {
    const { name, value } = e.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value
    }));
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

    if (
      !formulario.cliente_id ||
      !formulario.tecnico_id ||
      !formulario.descripcion.trim() ||
      !formulario.estado ||
      !formulario.fecha
    ) {
      mostrarMensaje("Completa todos los campos obligatorios.", "error");
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
        mostrarMensaje(
          respuesta.datos?.mensaje ||
          respuesta.datos?.message ||
          "No fue posible guardar el servicio.",
          "error"
        );
        return;
      }

      const texto = editando
        ? "Servicio actualizado correctamente."
        : "Servicio registrado correctamente.";

      limpiarFormulario();

      const actualizado = await cargarDatos(false);

      mostrarMensaje(
        actualizado
          ? texto
          : `${texto} No se pudo actualizar la tabla; vuelve a cargar los datos.`,
        actualizado ? "exito" : "info"
      );
    } catch (error) {
      console.error("Error al guardar servicio:", error);
      mostrarMensaje(
        "No fue posible conectar con el servidor. Inténtalo de nuevo.",
        "error"
      );
    } finally {
      setCargando(false);
    }
  }

  function prepararEdicion(servicio) {
    setEditando(servicio.id);

    setFormulario({
      cliente_id: String(servicio.cliente_id ?? ""),
      tecnico_id: String(servicio.tecnico_id ?? ""),
      descripcion: servicio.descripcion || "",
      estado: servicio.estado || "Pendiente",
      fecha: String(servicio.fecha || "").slice(0, 10)
    });

    mostrarMensaje("Estás editando el servicio seleccionado.", "info");
  }

  async function borrarServicio(id) {
    if (!window.confirm("¿Deseas eliminar este servicio?")) {
      return;
    }

    setCargando(true);

    try {
      const respuesta = await eliminarServicio(id);

      if (!respuesta.ok) {
        mostrarMensaje(
          respuesta.datos?.mensaje ||
          respuesta.datos?.message ||
          "No fue posible eliminar el servicio.",
          "error"
        );
        return;
      }

      if (editando === id) {
        limpiarFormulario();
      }

      const actualizado = await cargarDatos(false);

      mostrarMensaje(
        actualizado
          ? "Servicio eliminado correctamente."
          : "Servicio eliminado, pero no se pudo actualizar la tabla.",
        actualizado ? "exito" : "info"
      );
    } catch (error) {
      console.error("Error al eliminar servicio:", error);
      mostrarMensaje(
        "No fue posible conectar con el servidor.",
        "error"
      );
    } finally {
      setCargando(false);
    }
  }

  const coloresMensaje = {
    exito: {
      fondo: "#e6f4ea",
      texto: "#176b35",
      borde: "#2e8540"
    },
    error: {
      fondo: "#fdecec",
      texto: "#a32121",
      borde: "#c62828"
    },
    info: {
      fondo: "#eaf2ff",
      texto: "#174ea6",
      borde: "#3973c6"
    }
  };

  const estiloMensaje = coloresMensaje[tipoMensaje];

  return (
    <main style={{
      padding: "24px",
      maxWidth: "1100px",
      margin: "auto",
      fontFamily: "Arial, sans-serif"
    }}>
      <h1>Módulo de Servicios</h1>
      <p>Registra y administra los servicios técnicos.</p>

      {mensaje && (
        <div
          role={tipoMensaje === "error" ? "alert" : "status"}
          aria-live="polite"
          style={{
            padding: "14px",
            margin: "16px 0",
            borderLeft: `5px solid ${estiloMensaje.borde}`,
            borderRadius: "6px",
            background: estiloMensaje.fondo,
            color: estiloMensaje.texto,
            fontWeight: "bold"
          }}
        >
          {mensaje}
        </div>
      )}

      <section style={{
        padding: "20px",
        marginBottom: "24px",
        background: "#fff",
        border: "1px solid #ddd",
        borderRadius: "10px"
      }}>
        <h2>{editando ? "Editar servicio" : "Registrar servicio"}</h2>

        <form onSubmit={guardarServicio}>
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

          <br /><br />

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

          <br /><br />

          <label htmlFor="descripcion">Descripción</label>
          <br />
          <input
            id="descripcion"
            name="descripcion"
            value={formulario.descripcion}
            onChange={manejarCambio}
            maxLength={255}
            required
            placeholder="Describe el servicio"
            disabled={cargando}
          />

          <br /><br />

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

          <br /><br />

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

          <br /><br />

          <button type="submit" disabled={cargando}>
            {cargando
              ? "Procesando..."
              : editando
                ? "Guardar cambios"
                : "Registrar servicio"}
          </button>

          {editando && (
            <button
              type="button"
              onClick={limpiarFormulario}
              disabled={cargando}
              style={{ marginLeft: "8px" }}
            >
              Cancelar edición
            </button>
          )}
        </form>
      </section>

      <h2>Servicios registrados</h2>

      <div style={{ overflowX: "auto" }}>
        <table style={{
          width: "100%",
          borderCollapse: "collapse"
        }}>
          <thead>
            <tr>
              {["ID", "Cliente", "Técnico", "Descripción", "Estado", "Fecha", "Acciones"].map((titulo) => (
                <th
                  key={titulo}
                  style={{
                    padding: "10px",
                    border: "1px solid #ddd",
                    background: "#f1f3f5",
                    textAlign: "left"
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
                <td style={celda}>{servicio.id}</td>
                <td style={celda}>{servicio.cliente_nombre}</td>
                <td style={celda}>{servicio.tecnico_nombre}</td>
                <td style={celda}>{servicio.descripcion}</td>
                <td style={celda}>{servicio.estado}</td>
                <td style={celda}>{String(servicio.fecha).slice(0, 10)}</td>
                <td style={celda}>
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
                <td colSpan="7" style={celda}>
                  No hay servicios registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

const celda = {
  padding: "10px",
  border: "1px solid #ddd"
};
