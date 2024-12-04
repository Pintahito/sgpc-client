import React from 'react';

const Home = ({ onNavigate }) => {
  return (
    <div className="flex flex-auto items-center justify-center min-h-screen bg-iosBackground dark:bg-iosDarkBackground">
      <div className="text-center px-4 py-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-3xl">
        <h1 className="text-4xl font-bold text-iosText dark:text-white mb-4">
          Bienvenido a <span className="text-iosBlue dark:text-iosDarkBlue"> Grupo Ingenios</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Nuestra empresa se dedica a la planificación, desarrollo y ejecución de proyectos de construcción
          innovadores y de alta calidad. Con un enfoque en la excelencia y la satisfacción del cliente,
          ofrecemos soluciones integrales para todas tus necesidades constructivas.
        </p>
        <div className="mt-6 inline-flex space-x-4">
          {/* Botón Explorar Proyectos */}
          <button
            className="px-6 py-3 bg-iosBlue text-white text-lg font-semibold rounded-full shadow-md hover:bg-iosBlueHover dark:bg-iosDarkBlue dark:hover:bg-iosDarkBlueHover transition-all"
            onClick={() => onNavigate('proyectos')} // Reemplaza 'proyectos' con la página deseada
          >
            Explorar proyectos
          </button>

          {/* Botón Clientes */}
          <button
            className="px-6 py-3 bg-iosBlue text-white text-lg font-semibold rounded-full shadow-md hover:bg-iosGreenHover dark:bg-iosDarkGreen dark:hover:bg-iosDarkGreenHover transition-all"
            onClick={() => onNavigate('clientes')} // Navegar a la página de Clientes
          >
            Clientes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
