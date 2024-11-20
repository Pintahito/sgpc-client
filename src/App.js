import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import { FaSun, FaMoon, FaBars, FaTimes } from 'react-icons/fa';

import Clientes from './components/compCliente/Clientes';
import Empleados from './components/compEmpleado/Empleados';
import Inventario from './components/compInvetario/Inventario';
import EmpleadoExt from './components/compServicio/EmpleadoExt';
import PuestoEmp from './components/compPuesto/PuestoEmp';
import Maquinaria from './components/compMaquinaria/Maquinaria';
import Departamentos from './components/compDepartamento/Departamentos';
import Proveedores from './components/Proveedor/Proveedores';
import Banco from './components/compBanco/Banco';
import DocDrive from './components/compDoc/DocDrive';

import './css/Modal.css';
import './css/App.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [activePage, setActivePage] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
      case 'empleadoext':
        return <EmpleadoExt />;
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
            <div
              className="flex items-center cursor-pointer"
              onClick={() => setDarkMode(!darkMode)}
            >
              <div
                className={`w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 duration-300 ${darkMode ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
              >
                <div
                  className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-300 ${darkMode ? 'translate-x-6' : ''
                    }`}
                ></div>
              </div>
              <span className="ml-3 text-xl">
                {darkMode ? <FaMoon className="text-yellow-300" /> : <FaSun className="text-yellow-500" />}
              </span>
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

export default App;
