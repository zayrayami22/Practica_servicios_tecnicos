import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RutaProtegida from "./components/RutaProtegida";
import Clientes from "./pages/Clientes";
import Tecnicos from "./pages/Tecnicos";
import Servicios from "./pages/Servicios";

function App() {
  return (
    <Routes>
      {/* Página de inicio de sesión */}
      <Route path="/" element={<Login />} />

      {/* Dashboard protegido */}
      <Route
        path="/dashboard"
        element={
          <RutaProtegida>
            <Dashboard />
          </RutaProtegida>
        }
      />

      {/* Módulo de clientes protegido */}
      <Route
        path="/clientes"
        element={
          <RutaProtegida>
            <Clientes />
          </RutaProtegida>
        }
      />

      {/* Módulo de técnicos protegido */}
      <Route
        path="/tecnicos"
        element={
          <RutaProtegida>
            <Tecnicos />
          </RutaProtegida>
        }
      />

      {/* Módulo de servicios protegido */}
      <Route
        path="/servicios"
        element={
          <RutaProtegida>
            <Servicios />
          </RutaProtegida>
        }
      />

      {/* Redirigir las rutas desconocidas al login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;