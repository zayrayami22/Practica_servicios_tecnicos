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
    } catch (error) {
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
      let resultado;

      if (editandoId === null) {
        resultado = await crearCliente(nombre);
      } else {
        resultado = await actualizarCliente(editandoId, nombre);
      }

      if (resultado.ok && resultado.datos.success) {
        setNombre("");
        setEditandoId(null);

        if (editandoId === null) {
          setMensaje("Cliente creado correctamente");
        } else {
          setMensaje("Cliente actualizado correctamente");
        }

        await cargarClientes();
      } else {
        setMensaje(resultado.datos.message || "No se pudo guardar el cliente");
      }
    } catch (error) {
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
    const confirmar = window.confirm(
      "¿Estás seguro de que deseas eliminar este cliente?"
    );

    if (!confirmar) {
      return;
    }

    try {
      const resultado = await eliminarCliente(id);

      if (resultado.ok && resultado.datos.success) {
        setMensaje("Cliente eliminado correctamente");
        await cargarClientes();
      } else {
        setMensaje(resultado.datos.message || "No se pudo eliminar el cliente");
      }
    } catch (error) {
      setMensaje("Error al conectar con el servidor");
    }
  };

  return (
    <div className="dashboard">
      <h1>Clientes</h1>

      <form onSubmit={guardarCliente}>
        <input
          type="text"
          placeholder="Nombre del cliente"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <button type="submit">
          {editandoId === null ? "Agregar cliente" : "Guardar cambios"}
        </button>

        {editandoId !== null && (
          <button type="button" onClick={cancelarEdicion}>
            Cancelar
          </button>
        )}
      </form>

      {mensaje && <p className="error">{mensaje}</p>}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.id}>
              <td>{cliente.id}</td>
              <td>{cliente.nombre}</td>
              <td>
                <button onClick={() => editarCliente(cliente)}>
                  Editar
                </button>

                <button onClick={() => borrarCliente(cliente.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Clientes;