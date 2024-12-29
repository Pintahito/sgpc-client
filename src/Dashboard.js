import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import { FaSun, FaMoon, FaBars, FaTimes } from 'react-icons/fa';
import { CiLogin } from "react-icons/ci";
import { GrUserSettings } from "react-icons/gr";
import Swal from 'sweetalert2';

import Clientes from './components/compCliente/Clientes';
import Empleados from './components/compEmpleado/Empleados';
import Inventario from './components/compInvetario/Inventario';
import Categoria from './components/compCategoria/Categoria';
import PuestoEmp from './components/compPuesto/PuestoEmp'
import Maquinaria from './components/compMaquinaria/Maquinaria';
import Departamentos from './components/compDepartamento/Departamentos';
import Proveedores from './components/Proveedor/Proveedores';
import Banco from './components/compBanco/Banco';
import DocDrive from './components/compDoc/FileManager';
import KPIContainer from './components/compKPI/KPIContainer';
import ConfigUsers from './components/compUsers/ConfigUsers';
import Maintenance from './components/compMantenimiento/Maintenance';

import axios from "./api/axios"; // Asegúrate de que este archivo esté configurado para manejar peticiones con Axios.


import './css/Modal.css';
import './css/App.css';


const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activePage, setActivePage] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  //cerrar sesion funcion 
  async function logout() {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found, cannot logout.");
      return;
    }

    axios.post("/api/auth/logout", {}, // El cuerpo puede estar vacío
      {
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
        },
      }
    )
      .then(() => {
        // Elimina el token del almacenamiento local
        localStorage.removeItem("token");

        Swal.fire("!Cerraste sesion correctamente!");

        // Redirige al login
        window.location.href = "/login";
      })
      .catch((error) => {
        console.error("Error al cerrar sesión:", error);
      });
  }

  const handleNavigate = (page) => {
    setActivePage(page);
  };

  const renderContent = () => {
    switch (activePage) {
      case 'home':
        return <Home onNavigate={handleNavigate} />;
      case 'clientes':
        return <Clientes />;
      case 'recursoshumanos':
        return <div>Recursos Humanos</div>;
      case 'empleados':
        return <Empleados />;
      case 'categoria':
        return <Categoria />;
      case 'puestoemp':
        return <PuestoEmp />;
      case 'inventario':
        return <Inventario />;
      case 'maquinaria':
        return <Maquinaria />;
      case 'departamento':
        return <Departamentos />;
      case 'banco':
        return <Banco />;
      case 'proveedores':
        return <Proveedores />;
      case 'documental':
        return <DocDrive />;
      case 'kpi':
        return <KPIContainer />;
      case 'usuarios':
        return <ConfigUsers />;
      case 'mant':
        return <Maintenance />;
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="flex h-screen bg-iosGray dark:bg-iosDarkBackground">
        {/* Sidebar */}
        {isSidebarOpen && (
          <Sidebar onNavigate={handleNavigate} active={activePage} />
        )}

        {/* Main content */}
        <div className="flex flex-col flex-auto transition-all duration-300">
          {/* Header */}
          <header className="flex justify-between items-center p-4 bg-iosBackground dark:bg-iosDarkBackground shadow">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-iosBlue text-2xl p-2"
            >
              {isSidebarOpen ? <FaTimes /> : <FaBars />}
            </button>
            <h1 className="text-6xl font-bold text-iosText dark:text-white">Grupo Ingenios</h1>

            {/* Botón Deslizable para Modo Oscuro */}
            <div className="flex items-center">
              {/* Toggle de Modo Oscuro */}
              <div
                className={`w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 duration-300 ${darkMode ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                onClick={() => setDarkMode(!darkMode)}
              >
                <div
                  className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-300 ${darkMode ? 'translate-x-6' : ''
                    }`}
                ></div>
              </div>
              <span className="ml-3 text-xl">
                {darkMode ? <FaMoon className="text-yellow-300" /> : <FaSun className="text-yellow-500" />}
              </span>
              {/* Botón Gestion Usuarios */}
              <button onClick={() => handleNavigate('usuarios')} className="ml-4 flex items-center bg-gradient-to-r from-red-500 to-pink-500 hover:from-pink-500 hover:to-red-500 text-white font-semibold py-2 px-6 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out" >
                <GrUserSettings className="text-2xl mr-2 animate-spin-slow" />
                Users
              </button>

              {/* Botón de Cerrar Sesión */}
              <button onClick={logout}
                className="ml-4 flex items-center bg-gradient-to-r from-red-500 to-pink-500 hover:from-pink-500 hover:to-red-500 text-white font-semibold py-2 px-6 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out" >
                <CiLogin className="text-2xl mr-2 animate-spin-slow" />
                Exit
              </button>

            </div>
          </header>

          {/* Main content */}
          <main className="flex-auto p-6 overflow-y-auto">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
