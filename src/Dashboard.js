import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { FaSun, FaMoon, FaBars, FaTimes } from "react-icons/fa";
import { CiLogin } from "react-icons/ci";
import { GrUserSettings } from "react-icons/gr";
import Swal from "sweetalert2";
import axios from "./api/axios";
import { jwtDecode } from "jwt-decode";
import "./css/Modal.css";
import "./css/App.css";

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
import Schedule from "./components/compSchedule/Schedule";

const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);
        const timeLeft = decodedToken.exp - currentTime;

        if (timeLeft <= 0) {
          Swal.fire({
            title: "Sesión expirada",
            text: "Tu sesión ha finalizado. Por favor, vuelve a iniciar sesión.",
            icon: "warning",
            confirmButtonText: "Aceptar",
            background: "#f8d7da",
            color: "#721c24",
          }).then(() => {
            localStorage.removeItem("token");
            navigate("/login");
          });
        } else if (timeLeft <= 60) {
          Swal.fire({
            title: "Sesión por expirar",
            text: "Tu sesión está por expirar en menos de 1 minuto. Guarda tu trabajo.",
            icon: "info",
            confirmButtonText: "Entendido",
            background: "#fff3cd",
            color: "#856404",
          });
        }
      } catch (error) {
        console.error("Error al verificar el token:", error);
      }
    };

    const interval = setInterval(checkTokenExpiration, 10000); // Verificar cada 10 segundos
    return () => clearInterval(interval);
  }, [navigate]);

  const logout = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No se encontró token.");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos

      if (decodedToken.exp && decodedToken.exp < currentTime) {
        Swal.fire({
          title: "Sesión Expirada",
          html: `Cerrando sesión en <b>0%</b>. <br> Por favor espera...`,
          timer: 2000,
          timerProgressBar: true,
          background: "#f8d7da",
          color: "#721c24",
          icon: "warning",
          iconColor: "#f5c6cb",
          didOpen: () => {
            Swal.showLoading();
            const percentage = Swal.getHtmlContainer().querySelector("b");
            const totalTime = Swal.getTimerLeft();
            let timerInterval = setInterval(() => {
              const timeLeft = Swal.getTimerLeft();
              const percentComplete = Math.round(
                ((totalTime - timeLeft) / totalTime) * 100
              );
              percentage.textContent = `${percentComplete}%`;
            }, 100);
            Swal.willClose = () => clearInterval(timerInterval);
          },
        }).then(() => {
          localStorage.removeItem("token");
          navigate("/login");
        });
        return;
      }

      // Si el token aún es válido, realizar el logout
      await axios.post("/api/auth/logout", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Swal.fire({
        title: "Estas Saliendo Del Sistema",
        html: `Cerrando sesión en <b>0%</b>. <br> Por favor espera...`,
        timer: 2000,
        timerProgressBar: true,
        background: "#f8d7da",
        color: "#721c24",
        icon: "warning",
        iconColor: "#f5c6cb",
        didOpen: () => {
          Swal.showLoading();
          const percentage = Swal.getHtmlContainer().querySelector("b");
          const totalTime = Swal.getTimerLeft();
          let timerInterval = setInterval(() => {
            const timeLeft = Swal.getTimerLeft();
            const percentComplete = Math.round(
              ((totalTime - timeLeft) / totalTime) * 100
            );
            percentage.textContent = `${percentComplete}%`;
          }, 100);
          Swal.willClose = () => clearInterval(timerInterval);
        },
      }).then(() => {
        localStorage.removeItem("token");
        navigate("/login");
      });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex h-screen bg-iosGray dark:bg-iosDarkBackground">
        {/* Sidebar */}
        {isSidebarOpen && <Sidebar active={window.location.pathname.slice(1)} />}

        {/* Main Content */}
        <div className="flex flex-col flex-auto transition-all duration-300">
          {/* Header */}
          <header className="flex justify-between items-center p-4 bg-iosBackground dark:bg-iosDarkBackground shadow">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-iosBlue text-2xl p-2"
            >
              {isSidebarOpen ? <FaTimes /> : <FaBars />}
            </button>
            <h1 className="text-6xl p-3 font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-red-500 drop-shadow-lg dark:drop-shadow-xl hover:scale-105 transition-transform duration-300">
              Grupo Ingenios
            </h1>
            <div className="flex items-center">
              {/* Dark Mode Toggle */}
              <div
                className={`w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 duration-300 ${darkMode ? "bg-blue-600" : "bg-gray-300"}`}
                onClick={() => setDarkMode(!darkMode)}
              >
                <div
                  className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-300 ${darkMode ? "translate-x-6" : ""}`}
                ></div>
              </div>
              <span className="ml-3 text-xl">
                {darkMode ? <FaMoon className="text-yellow-300" /> : <FaSun className="text-yellow-500" />}
              </span>
              <button
                onClick={() => navigate("/dashboard/usuarios")}
                className="ml-4 flex items-center bg-gradient-to-r from-red-500 to-pink-500 text-white py-2 px-6 rounded-full shadow-lg transform hover:scale-105 transition-all"
              >
                <GrUserSettings className="text-2xl mr-2" />
                Gestión Usuarios
              </button>
              <button
                onClick={logout}
                className="ml-4 flex items-center bg-gradient-to-r from-red-500 to-pink-500 text-white py-2 px-6 rounded-full shadow-lg transform hover:scale-105 transition-all"
              >
                <CiLogin className="text-2xl mr-2" />
                Exit
              </button>
            </div>
          </header>
          {/* Routes */}
          <main className="flex-auto p-6 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/clientes" element={<Clientes />} />
              <Route path="/empleados" element={<Empleados />} />
              <Route path="/categorias" element={<Categoria />} />
              <Route path="/puestos" element={<PuestoEmp />} />
              <Route path="/inventario" element={<Inventario />} />
              <Route path="/maquinaria" element={<Maquinaria />} />
              <Route path="/departamentos" element={<Departamentos />} />
              <Route path="/banco" element={<Banco />} />
              <Route path="/proveedores" element={<Proveedores />} />
              <Route path="/kpi" element={<KPIContainer />} />
              <Route path="/usuarios" element={<ConfigUsers />} />
              <Route path="/mantenimientos" element={<Maintenance />} />
              <Route path="/obras" element={<Obras />} />
              <Route path="/tiposobra" element={<TipoObra />} />
              <Route path="/actividades" element={<Actividad />} />
              <Route path="/etapas" element={<Etapa />} />
              <Route path="/schedule" element={<Schedule />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;