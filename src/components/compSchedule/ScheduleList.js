import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { FaEdit, FaTrash, FaEye  } from "react-icons/fa";

function ScheduleList({ schedules, setScheduleEditada, setModalType, setScheduleSeleccionada, fetchScheduledActivities, }) {
  const [filterText, setFilterText] = useState("");
  const [filteredSchedules, setFilteredSchedules] = useState(schedules);

  // Filtrar datos según el texto de búsqueda
  useEffect(() => {
    const filteredData = schedules.filter(
      (schedule) =>
        schedule.name &&
        schedule.name.toLowerCase().includes(filterText.toLowerCase())
    );
    setFilteredSchedules(filteredData);
  }, [filterText, schedules]);

  // Definir columnas de la tabla
  const columns = [
    {
      name: "Nombre",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Descripción",
      selector: (row) => row.description,
      sortable: true,
    },
    {
      name: "Estatus",
      selector: (row) => row.status,
      sortable: true,
    },
    {
      name: "Fecha de Creación",
      selector: (row) => new Date(row.created_at).toLocaleDateString(),
      sortable: true,
    },
    {
      name: "Fecha de Modificación",
      selector: (row) => new Date(row.lastModifiedDate).toLocaleDateString(),
      sortable: true,
    },
    {
      name: "Acciones",
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 transition"
            onClick={() => {
              setScheduleEditada(row);
              setModalType("edit");
            }}
          >
            <FaEdit />
          </button>
          <button
            className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition"
            onClick={() => {
              setScheduleSeleccionada(row);
              setModalType("delete");
            }}
          >
            <FaTrash />
          </button>

             {/* Botón Ver */}
          <button
            className="bg-green-500 text-white py-1 px-3 rounded-md hover:bg-green-600 transition"
            onClick={() => fetchScheduledActivities(row.idSchedule)} // Llama a la función para obtener actividades
            title="Ver actividades"
          >
            <FaEye />
          </button>
           
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 relative z-0">
      <div className="mb-4">
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md text-black dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Buscar por nombre..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>
      <DataTable
        columns={columns}
        data={filteredSchedules}
        pagination
        fixedHeader
        highlightOnHover
        noDataComponent={
          <p className="text-center text-gray-500 dark:text-gray-400">
            No hay horarios registrados.
          </p>
        }
      />
    </div>
  );
}

export default ScheduleList;