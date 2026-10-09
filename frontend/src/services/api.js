const API_URL = "http://127.0.0.1:5000";

// LOGIN
export async function login(username, password) {
  const respuesta = await fetch(`${API_URL}/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username,
      password
    })
  });

  const datos = await respuesta.json();

  return {
    ok: respuesta.ok,
    status: respuesta.status,
    datos
  };
}


// OBTENER CLIENTES
export async function obtenerClientes() {
  const respuesta = await fetch(`${API_URL}/api/clientes`);

  const datos = await respuesta.json();

  return {
    ok: respuesta.ok,
    status: respuesta.status,
    datos
  };
}


// CREAR CLIENTE
export async function crearCliente(nombre) {
  const respuesta = await fetch(`${API_URL}/api/clientes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      nombre
    })
  });

  const datos = await respuesta.json();

  return {
    ok: respuesta.ok,
    status: respuesta.status,
    datos
  };
}


// ACTUALIZAR CLIENTE
export async function actualizarCliente(id, nombre) {
  const respuesta = await fetch(`${API_URL}/api/clientes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      nombre
    })
  });

  const datos = await respuesta.json();

  return {
    ok: respuesta.ok,
    status: respuesta.status,
    datos
  };
}


// ELIMINAR CLIENTE
export async function eliminarCliente(id) {
  const respuesta = await fetch(`${API_URL}/api/clientes/${id}`, {
    method: "DELETE"
  });

  const datos = await respuesta.json();

  return {
    ok: respuesta.ok,
    status: respuesta.status,
    datos
  };
}


const API_TECNICOS = "http://127.0.0.1:5000/api/tecnicos";

export async function obtenerTecnicos() {
  const r = await fetch(API_TECNICOS);
  return { ok: r.ok, datos: await r.json() };
}

export async function crearTecnico(tecnico) {
  const r = await fetch(API_TECNICOS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tecnico)
  });

  return { ok: r.ok, datos: await r.json() };
}

export async function actualizarTecnico(id, tecnico) {
  const r = await fetch(`${API_TECNICOS}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tecnico)
  });

  return { ok: r.ok, datos: await r.json() };
}

export async function eliminarTecnico(id) {
  const r = await fetch(`${API_TECNICOS}/${id}`, {
    method: "DELETE"
  });

  return { ok: r.ok, datos: await r.json() };
}