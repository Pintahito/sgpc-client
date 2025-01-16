import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaUsers, FaToolbox, FaChartBar, FaClipboardList, FaTruck, FaWarehouse, FaCogs} from "react-icons/fa";
import { BiSolidBank } from "react-icons/bi";

const Sidebar = () => {
  const [isHRDropdownOpen, setIsHRDropdownOpen] = useState(false);
  const location = useLocation(); // Para obtener la ruta actual.

  const toggleHRDropdown = () => {
    setIsHRDropdownOpen(!isHRDropdownOpen);
  };

  // Función para determinar si la ruta está activa.
  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 h-full bg-gray-900 text-white dark:bg-gray-800 dark:text-gray-300 shadow-lg overflow-y-auto transition-all">
      {/* Logo e imagen superior */}
      <div className="flex items-center justify-center py-6">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYOyln4kwaggy0dR6EWDsh9Kfvs6OiE7-Dhg&s"
          alt="Logo"
          className="w-32 h-auto rounded-lg"
        />
      </div>

      {/* Opciones de navegación */}
      <nav className="flex flex-col space-y-2 px-4">
        <Link
          to="/dashboard"
          className={`flex items-center py-3 px-4 rounded-lg transition-all ${
            isActive("/dashboard")
              ? "bg-blue-600 text-white"
              : "hover:bg-blue-700 dark:hover:bg-blue-600"
          }`}
        >
          <FaHome className="mr-3" />
          Gestión De Proyectos
        </Link>

        {/* Dropdown de Recursos Humanos */}
        <button
          onClick={toggleHRDropdown}
          className={`flex items-center justify-between w-full py-3 px-4 rounded-lg transition-all ${
            location.pathname.includes("/dashboard/recursoshumanos")
              ? "bg-blue-600 text-white"
              : "hover:bg-blue-700 dark:hover:bg-blue-600"
          }`}
        >
          <div className="flex items-center">
            <FaUsers className="mr-3" />
            Recursos Humanos
          </div>
          <span className={`transition-transform ${isHRDropdownOpen ? "rotate-180" : ""}`}>▼</span>
        </button>

        {isHRDropdownOpen && (
          <div className="ml-6 space-y-2">
            <Link
              to="/dashboard/empleados"
              className={`flex items-center py-3 px-4 rounded-lg transition-all ${
                isActive("/dashboard/empleados")
                  ? "bg-blue-600 text-white"
                  : "hover:bg-blue-700 dark:hover:bg-blue-600"
              }`}
            >
              <FaUsers className="mr-3" />
              Gestión Empleados
            </Link>
            <Link
              to="/dashboard/categoria"
              className={`flex items-center py-3 px-4 rounded-lg transition-all ${
                isActive("/dashboard/categoria")
                  ? "bg-blue-600 text-white"
                  : "hover:bg-blue-700 dark:hover:bg-blue-600"
              }`}
            >
              <FaClipboardList className="mr-3" />
              Gestión Categoría
            </Link>
            <Link
              to="/dashboard/puestoemp"
              className={`flex items-center py-3 px-4 rounded-lg transition-all ${
                isActive("/dashboard/puestoemp")
                  ? "bg-blue-600 text-white"
                  : "hover:bg-blue-700 dark:hover:bg-blue-600"
              }`}
            >
              <FaToolbox className="mr-3" />
              Gestión Puestos
            </Link>
            <Link
              to="/dashboard/departamento"
              className={`flex items-center py-3 px-4 rounded-lg transition-all ${
                isActive("/dashboard/departamento")
                  ? "bg-blue-600 text-white"
                  : "hover:bg-blue-700 dark:hover:bg-blue-600"
              }`}
            >
              <FaWarehouse className="mr-3" />
              Gestión Departamento
            </Link>
            <Link
              to="/dashboard/banco"
              className={`flex items-center py-3 px-4 rounded-lg transition-all ${
                isActive("/dashboard/banco")
                  ? "bg-blue-600 text-white"
                  : "hover:bg-blue-700 dark:hover:bg-blue-600"
              }`}
            >
              <BiSolidBank className="mr-3" />
              Bancos
            </Link>
          </div>
        )}

        <Link
          to="/dashboard/inventario"
          className={`flex items-center py-3 px-4 rounded-lg transition-all ${
            isActive("/dashboard/inventario")
              ? "bg-blue-600 text-white"
              : "hover:bg-blue-700 dark:hover:bg-blue-600"
          }`}
        >
          <FaClipboardList className="mr-3" />
          Gestión Inventario
        </Link>
        <Link
          to="/dashboard/maquinaria"
          className={`flex items-center py-3 px-4 rounded-lg transition-all ${
            isActive("/dashboard/maquinaria")
              ? "bg-blue-600 text-white"
              : "hover:bg-blue-700 dark:hover:bg-blue-600"
          }`}
        >
          <FaTruck className="mr-3" />
          Gestión Maquinaria
        </Link>
        <Link
          to="/dashboard/proveedores"
          className={`flex items-center py-3 px-4 rounded-lg transition-all ${
            isActive("/dashboard/proveedores")
              ? "bg-blue-600 text-white"
              : "hover:bg-blue-700 dark:hover:bg-blue-600"
          }`}
        >
          <FaWarehouse className="mr-3" />
          Proveedores
        </Link>
        <Link
          to="/dashboard/kpi"
          className={`flex items-center py-3 px-4 rounded-lg transition-all ${
            isActive("/dashboard/kpi")
              ? "bg-blue-600 text-white"
              : "hover:bg-blue-700 dark:hover:bg-blue-600"
          }`}
        >
          <FaChartBar className="mr-3" />
          Panel KPI
        </Link>
        <Link
          to="/dashboard/mant"
          className={`flex items-center py-3 px-4 rounded-lg transition-all ${
            isActive("/dashboard/mant")
              ? "bg-blue-600 text-white"
              : "hover:bg-blue-700 dark:hover:bg-blue-600"
          }`}
        >
          <FaCogs className="mr-3" />
          Mantenimiento
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
