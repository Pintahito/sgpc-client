import React, { useState } from 'react';

const Sidebar = ({ onNavigate, active }) => {
  const [isHRDropdownOpen, setIsHRDropdownOpen] = useState(false);

  const toggleHRDropdown = () => {
    setIsHRDropdownOpen(!isHRDropdownOpen);
  };

  return (
    <div className="w-64 h-full bg-iosBackground dark:bg-iosDarkBackground p-4 shadow-lg">
      <nav className="flex flex-col space-y-0">
        <button
          onClick={() => onNavigate('home')}
          className={`w-full py-2 px-4 text-left rounded-none border-b ${active === 'home' ? 'bg-iosBlue text-white' : 'text-iosText dark:text-gray-300 hover:bg-iosHover'} focus:outline-none focus:bg-iosBlue focus:text-white`}
        >
          Gestión De Proyectos
        </button>

        <button
          onClick={toggleHRDropdown}
          className={`w-full py-2 px-4 text-left flex justify-between items-center rounded-none border-b ${active === 'recursoshumanos' ? 'bg-iosBlue text-white' : 'text-iosText dark:text-gray-300 hover:bg-iosHover'} focus:outline-none focus:bg-iosBlue focus:text-white`}
        >
          Recursos Humanos
          <span
            className={`transition-transform duration-300 ${isHRDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
          >
            ▼
          </span>
        </button>

        {isHRDropdownOpen && (
          <div className="ml-4 space-y-0">
            <button
              onClick={() => onNavigate('empleados')}
              className={`w-full py-2 px-4 text-left rounded-none border-b ${active === 'empleados' ? 'bg-iosBlue text-white' : 'text-iosText dark:text-gray-300 hover:bg-iosHover'} focus:outline-none focus:bg-iosBlue focus:text-white`}
            >
              Gestión Empleados
            </button>
            <button
              onClick={() => onNavigate('nomina')}
              className={`w-full py-2 px-4 text-left rounded-none border-b ${active === 'nomina' ? 'bg-iosBlue text-white' : 'text-iosText dark:text-gray-300 hover:bg-iosHover'} focus:outline-none focus:bg-iosBlue focus:text-white`}
            >
              Gestión Nómina
            </button>
            <button
              onClick={() => onNavigate('puesto')}
              className={`w-full py-2 px-4 text-left rounded-none border-b ${active === 'puesto' ? 'bg-iosBlue text-white' : 'text-iosText dark:text-gray-300 hover:bg-iosHover'} focus:outline-none focus:bg-iosBlue focus:text-white`}
            >
              Gestión Puestos
            </button>
            <button
              onClick={() => onNavigate('servicios')}
              className={`w-full py-2 px-4 text-left rounded-none border-b ${active === 'servicios' ? 'bg-iosBlue text-white' : 'text-iosText dark:text-gray-300 hover:bg-iosHover'} focus:outline-none focus:bg-iosBlue focus:text-white`}
            >
              Gestión Servicios
            </button>
          </div>
        )}

        <button
          onClick={() => onNavigate('inventario')}
          className={`w-full py-2 px-4 text-left rounded-none border-b ${active === 'inventario' ? 'bg-iosBlue text-white' : 'text-iosText dark:text-gray-300 hover:bg-iosHover'} focus:outline-none focus:bg-iosBlue focus:text-white`}
        >
          Gestión Inventario
        </button>
        <button
          onClick={() => onNavigate('dashboard')}
          className={`w-full py-2 px-4 text-left rounded-none border-b ${active === 'dashboard' ? 'bg-iosBlue text-white' : 'text-iosText dark:text-gray-300 hover:bg-iosHover'} focus:outline-none focus:bg-iosBlue focus:text-white`}
        >
          Panel
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
