import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate(); // Hook para navegación.

  const buttons = [
    {
      label: "Explorar Obras",
      route: "/dashboard/obras",
      image: "https://meprosaconstrucciones.mx/wp-content/uploads/2022/07/architect-3979490_1920-min.jpg",
    },
    {
      label: "Clientes",
      route: "/dashboard/clientes",
      image: "https://www.ceramicacoboce.com/wp-content/uploads/2022/08/Rubro-de-la-construccion-Marketing-que-asegura-clientes-2048x1152.jpg",
    },
    {
      label: "Tipos De Obra",
      route: "/dashboard/typeobra",
      image: "https://q-ver.com/wp-content/uploads/2021/01/estudios_integrales_4-2048x1388.jpg",
    },
    {
      label: "Actividades",
      route: "/dashboard/actividad",
      image: "https://media.electroinstalador.com/p/c851f829345ab3900a695f0b14767bfe/adjuntos/232/imagenes/000/026/0000026591/1200x0/smart/img-construccion-00jpg.jpg",
    },
    {
      label: "Etapas",
      route: "/dashboard/etapa",
      image: "https://www.cdt.cl/wp-content/uploads/2023/02/1675221061lUzXC6Pt.jpg",
    },
  ];

  const nextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % buttons.length);
  };

  const prevSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + buttons.length) % buttons.length);
  };

  return (
    <div className="flex flex-col items-center justify-top min-h-screen bg-iosBackground dark:bg-iosDarkBackground">
      <div className="text-center px-16 py-28 bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-5xl">
        <h1 className="text-4xl font-bold text-iosText dark:text-white mb-4">
          Bienvenido a <span className="text-iosBlue dark:text-iosDarkBlue">Grupo Ingenios</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Nuestra empresa se dedica a la planificación, desarrollo y ejecución de proyectos de construcción
          innovadores y de alta calidad. Con un enfoque en la excelencia y la satisfacción del cliente,
          ofrecemos soluciones integrales para todas tus necesidades constructivas.
        </p>

        <div className="relative w-full max-w-4xl h-80">
          <div className="relative h-full">
            <img
              src={buttons[activeIndex].image}
              alt={buttons[activeIndex].label}
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
            <button
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all"
              onClick={prevSlide}
            >
              <FaChevronLeft size={24} />
            </button>
            <button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all"
              onClick={nextSlide}
            >
              <FaChevronRight size={24} />
            </button>
          </div>
          <div className="flex justify-center mt-6">
            <button
              className="flex items-center bg-gradient-to-r from-red-500 to-pink-500 hover:from-pink-500 hover:to-red-500 text-white font-semibold py-4 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
              onClick={() => navigate(buttons[activeIndex].route)} // Navegación directa.
            >
              {buttons[activeIndex].label}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
