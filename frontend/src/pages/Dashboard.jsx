import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
const { usuario, cerrarSesion } = useAuth();

return ( <div className="dashboard"> <h1>Dashboard</h1>

```
  <h2>Bienvenido, {usuario?.username}</h2>

  <nav>
    <Link to="/dashboard">Inicio</Link>
    <Link to="/clientes">Clientes</Link>
    <Link to="/tecnicos">Técnicos</Link>
  </nav>

  <button onClick={cerrarSesion}>Cerrar sesión</button>
</div>

);
}

export default Dashboard;
