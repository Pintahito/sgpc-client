import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login/Login";
import Dashboard from "./Dashboard";
import PrivateRoute from "./RoutePrivate/PrivateRoute";

function App() {
  return (
    <Router>
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
