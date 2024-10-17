import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Clientes from './components/compCliente/Clientes';

import './css/Modal.css';
import './css/App.css';
import Empleados from './components/compEmpleado/Empleados';



const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activePage, setActivePage] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Controla si la barra lateral está abierta

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
      case 'dashboard':
        return <Dashboard />;
      default:
        return <Home onNavigate={handleNavigate}/>;
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
              className="text-iosBlue text-sm font-medium"
            >
              {isSidebarOpen ? 'Ocultar menú' : 'Mostrar menú'}
            </button>
            <h1 className="text-6xl font-bold text-iosText dark:text-white">Grupo Ingenios</h1>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="text-iosBlue text-sm font-medium"
            >
              {darkMode ? 'Dia' : 'Noche'}
            </button>
          </header>

          {/* Main content */}
          <main className="flex-auto p-6 overflow-y-auto">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;
