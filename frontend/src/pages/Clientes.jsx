
import { useEffect, useState } from "react";
import {
  obtenerClientes,
  crearCliente,
  actualizarCliente,
  eliminarCliente
} from "../services/api";

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [nombre, setNombre] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      const resultado = await obtenerClientes();

      if (resultado.ok && resultado.datos.success) {
        setClientes(resultado.datos.clientes);
      } else {
        setMensaje("No se pudieron obtener los clientes");
      }
    } catch {
      setMensaje("Error al conectar con el servidor");
    }
  };

  const guardarCliente = async (e) => {
    e.preventDefault();

    if (!nombre.trim()) {
      setMensaje("El nombre es obligatorio");
      return;
    }

    try {
      const eraEdicion = editandoId !== null;
      const resultado = eraEdicion
        ? await actualizarCliente(editandoId, nombre.trim())
        : await crearCliente(nombre.trim());

      if (resultado.ok && resultado.datos.success) {
        setNombre("");
        setEditandoId(null);
        setMensaje(
          eraEdicion
            ? "Cliente actualizado correctamente"
            : "Cliente creado correctamente"
        );
        await cargarClientes();
      } else {
        setMensaje(resultado.datos.message || "No se pudo guardar el cliente");
      }
    } catch {
      setMensaje("Error al conectar con el servidor");
    }
  };

  const editarCliente = (cliente) => {
    setEditandoId(cliente.id);
    setNombre(cliente.nombre);
    setMensaje("");
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setNombre("");
    setMensaje("");
  };

  const borrarCliente = async (id) => {
    if (!window.confirm("¿Deseas eliminar este cliente?")) return;

    try {
      const resultado = await eliminarCliente(id);

      if (resultado.ok && resultado.datos.success) {
        setMensaje("Cliente eliminado correctamente");
        await cargarClientes();
      } else {
        setMensaje(resultado.datos.message || "No se pudo eliminar el cliente");
      }
    } catch {
      setMensaje("Error al conectar con el servidor");
    }
  };

  return (
    <main style={{ padding: "20px", maxWidth: "900px" }}>
      <h1 style={{ margin: "0 0 16px" }}>Clientes</h1>

      <form
        onSubmit={guardarCliente}
        style={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
          marginBottom: "12px",
          flexWrap: "wrap"
        }}
      >
        <input
          type="text"
          placeholder="Nombre del cliente"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          style={{
            padding: "9px",
            minWidth: "220px",
            flex: "1"
          }}
        />

        <button type="submit" style={{ padding: "9px 14px" }}>
          {editandoId === null ? "Agregar" : "Guardar"}
        </button>

        {editandoId !== null && (
          <button
            type="button"
            onClick={cancelarEdicion}
            style={{ padding: "9px 14px" }}
          >
            Cancelar
          </button>
        )}
      </form>

      {mensaje && (
        <p role="status" style={{ margin: "8px 0 14px" }}>
          {mensaje}
        </p>
      )}

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "left"
        }}
      >
        <thead>
          <tr>
            <th style={estiloCelda}>ID</th>
            <th style={estiloCelda}>Nombre</th>
            <th style={estiloCelda}>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.id}>
              <td style={estiloCelda}>{cliente.id}</td>
              <td style={estiloCelda}>{cliente.nombre}</td>
              <td style={estiloCelda}>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <button type="button" onClick={() => editarCliente(cliente)}>
                    Editar
                  </button>
                  <button type="button" onClick={() => borrarCliente(cliente.id)}>
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {clientes.length === 0 && (
            <tr>
              <td colSpan="3" style={estiloCelda}>
                No hay clientes registrados.
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

export default Clientes;
