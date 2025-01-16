import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { FaSun, FaMoon, FaBars, FaTimes } from "react-icons/fa";
import { CiLogin } from "react-icons/ci";
import { GrUserSettings } from "react-icons/gr";
import Swal from "sweetalert2";

import Home from "./components/Home";
import Clientes from "./components/compCliente/Clientes";
import Empleados from "./components/compEmpleado/Empleados";
import Inventario from "./components/compInvetario/Inventario";
import Categoria from "./components/compCategoria/Categoria";
import PuestoEmp from "./components/compPuesto/PuestoEmp";
import Maquinaria from "./components/compMaquinaria/Maquinaria";
import Departamentos from "./components/compDepartamento/Departamentos";
import Proveedores from "./components/Proveedor/Proveedores";
import Banco from "./components/compBanco/Banco";
import KPIContainer from "./components/compKPI/KPIContainer";
import ConfigUsers from "./components/compUsers/ConfigUsers";
import Maintenance from "./components/compMantenimiento/Maintenance";
import TipoObra from "./components/compTipoObra/TipoObra";
import Etapa from "./components/compEtapas/Etapa";
import Actividad from "./components/compActividades/Actividad";
import Obras from "./components/compObras/Obras";

import axios from "./api/axios"; // Configura Axios para manejar peticiones.

import "./css/Modal.css";
import "./css/App.css";

const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate(); // Para navegación programática.

  // Función para cerrar sesión.
  const logout = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, cannot logout.");
      return;
    }

    try {
      await axios.post(
        "/api/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      localStorage.removeItem("token");
      Swal.fire("¡Cerraste sesión correctamente!");
      navigate("/login"); // Redirigir al login.
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex h-screen bg-iosGray dark:bg-iosDarkBackground">
        {/* Sidebar */}
        {isSidebarOpen && <Sidebar active={window.location.pathname.slice(1)} />}

        {/* Main content */}
        <div className="flex flex-col flex-auto transition-all duration-300">
          {/* Header */}
          <header className="flex justify-between items-center p-4 bg-iosBackground dark:bg-iosDarkBackground shadow">
            {/* Botón para mostrar/ocultar Sidebar */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-iosBlue text-2xl p-2"
            >
              {isSidebarOpen ? <FaTimes /> : <FaBars />}
            </button>
            <h1 className="text-6xl font-bold text-iosText dark:text-white">
              Grupo Ingenios
            </h1>

            {/* Opciones del Header */}
            <div className="flex items-center">
              {/* Toggle de Modo Oscuro */}
              <div
                className={`w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 duration-300 ${
                  darkMode ? "bg-blue-600" : "bg-gray-300"
                }`}
                onClick={() => setDarkMode(!darkMode)}
              >
                <div
                  className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-300 ${
                    darkMode ? "translate-x-6" : ""
                  }`}
                ></div>
              </div>
              <span className="ml-3 text-xl">
                {darkMode ? (
                  <FaMoon className="text-yellow-300" />
                ) : (
                  <FaSun className="text-yellow-500" />
                )}
              </span>

              {/* Botón Gestión Usuarios */}
              <button
                onClick={() => navigate("/dashboard/usuarios")}
                className="ml-4 flex items-center bg-gradient-to-r from-red-500 to-pink-500 hover:from-pink-500 hover:to-red-500 text-white font-semibold py-2 px-6 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
              >
                <GrUserSettings className="text-2xl mr-2 animate-spin-slow" />
                Gestión Usuarios
              </button>

              {/* Botón de Cerrar Sesión */}
              <button
                onClick={logout}
                className="ml-4 flex items-center bg-gradient-to-r from-red-500 to-pink-500 hover:from-pink-500 hover:to-red-500 text-white font-semibold py-2 px-6 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
              >
                <CiLogin className="text-2xl mr-2 animate-spin-slow" />
                Exit
              </button>
            </div>
          </header>

          {/* Main content (Dynamic Routes) */}
          <main className="flex-auto p-6 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/clientes" element={<Clientes />} />
              <Route path="/empleados" element={<Empleados />} />
              <Route path="/categoria" element={<Categoria />} />
              <Route path="/puestoemp" element={<PuestoEmp />} />
              <Route path="/inventario" element={<Inventario />} />
              <Route path="/maquinaria" element={<Maquinaria />} />
              <Route path="/departamento" element={<Departamentos />} />
              <Route path="/banco" element={<Banco />} />
              <Route path="/proveedores" element={<Proveedores />} />
              <Route path="/kpi" element={<KPIContainer />} />
              <Route path="/usuarios" element={<ConfigUsers />} />
              <Route path="/mant" element={<Maintenance />} />
              <Route path="/obras" element={<Obras />} />
              <Route path="/typeobra" element={<TipoObra />} />
              <Route path="/actividad" element={<Actividad />} />
              <Route path="/etapa" element={<Etapa />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
