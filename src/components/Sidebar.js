import React, { useState } from 'react';


const Sidebar = ({ onNavigate, active }) => {
  const [isHRDropdownOpen, setIsHRDropdownOpen] = useState(false);

  const toggleHRDropdown = () => {
    setIsHRDropdownOpen(!isHRDropdownOpen);
  };

  return (
    <div className="w-64 h-full bg-iosBackground dark:bg-iosDarkBackground p-4 shadow-lg">
      {/* Espacio para la imagen */}
      <div className="flex justify-center mb-7">
        <img
          src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYOyln4kwaggy0dR6EWDsh9Kfvs6OiE7-Dhg&s'
          alt="Logo"
          className="w-20 h-20 object-cover rounded-full"
        />
      </div>

      <nav className="flex flex-col space-y-0">
        <button
          onClick={() => onNavigate('home')}
          className={`w-full py-2 px-4 text-left rounded-none border-b transition-transform transform hover:scale-105 ${active === 'home' ? 'bg-iosBlue text-white' : 'text-iosText dark:text-gray-300 hover:bg-iosHover'} focus:outline-none focus:bg-iosBlue focus:text-white`}
        >
          Gestión De Proyectos
        </button>

        <button
          onClick={toggleHRDropdown}
          className={`w-full py-2 px-4 text-left flex justify-between items-center rounded-none border-b transition-transform transform hover:scale-105 ${active === 'recursoshumanos' ? 'bg-iosBlue text-white' : 'text-iosText dark:text-gray-300 hover:bg-iosHover'} focus:outline-none focus:bg-iosBlue focus:text-white`}
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
              className={`w-full py-2 px-4 text-left rounded-none border-b transition-transform transform hover:scale-105 ${active === 'empleados' ? 'bg-iosBlue text-white' : 'text-iosText dark:text-gray-300 hover:bg-iosHover'} focus:outline-none focus:bg-iosBlue focus:text-white`}
            >
              Gestión Empleados
            </button>
            <button
              onClick={() => onNavigate('empleadoext')}
              className={`w-full py-2 px-4 text-left rounded-none border-b transition-transform transform hover:scale-105 ${active === 'empleadoext' ? 'bg-iosBlue text-white' : 'text-iosText dark:text-gray-300 hover:bg-iosHover'} focus:outline-none focus:bg-iosBlue focus:text-white`}
            >
              Gestión Servicios
            </button>
            <button
              onClick={() => onNavigate('puestoemp')}
              className={`w-full py-2 px-4 text-left rounded-none border-b transition-transform transform hover:scale-105 ${active === 'puestoemp' ? 'bg-iosBlue text-white' : 'text-iosText dark:text-gray-300 hover:bg-iosHover'} focus:outline-none focus:bg-iosBlue focus:text-white`}
            >
              Gestión Puestos
            </button>
            <button
              onClick={() => onNavigate('nomina')}
              className={`w-full py-2 px-4 text-left rounded-none border-b transition-transform transform hover:scale-105 ${active === 'nomina' ? 'bg-iosBlue text-white' : 'text-iosText dark:text-gray-300 hover:bg-iosHover'} focus:outline-none focus:bg-iosBlue focus:text-white`}
            >
              Gestión Nomina
            </button>
          </div>
        )}

        <button
          onClick={() => onNavigate('inventario')}
          className={`w-full py-2 px-4 text-left rounded-none border-b transition-transform transform hover:scale-105 ${active === 'inventario' ? 'bg-iosBlue text-white' : 'text-iosText dark:text-gray-300 hover:bg-iosHover'} focus:outline-none focus:bg-iosBlue focus:text-white`}
        >
          Gestión Inventario
        </button>
        <button
          onClick={() => onNavigate('maquinaria')}
          className={`w-full py-2 px-4 text-left rounded-none border-b transition-transform transform hover:scale-105 ${active === 'maquinaria' ? 'bg-iosBlue text-white' : 'text-iosText dark:text-gray-300 hover:bg-iosHover'} focus:outline-none focus:bg-iosBlue focus:text-white`}
        >
          Gestión Maquinaria y Vehiculos
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
