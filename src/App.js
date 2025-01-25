import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login/Login";
import Dashboard from "./Dashboard";
import PrivateRoute from "./RoutePrivate/PrivateRoute";
import TokenManager from "./TokenManager"; // Asegúrate de importar el gestor de tokens si lo usas

function App() {
  return (
    <Router>
      {/* TokenManager se puede usar aquí para manejar la expiración del token globalmente */}
      <TokenManager />

      <Routes>
        {/* Redirigir desde la raíz "/" a "/login" */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Ruta de inicio de sesión */}
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas dentro del Dashboard */}
        <Route
          path="/dashboard/*"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;