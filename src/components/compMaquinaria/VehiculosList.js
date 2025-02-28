import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import { FaEdit, FaTrash} from "react-icons/fa";

const VehiculosList = ({ vehiculos, setVehiculoEditado, setModalType, setVehiculoSeleccionado }) => {
  const [filterText, setFilterText] = useState('');

  const filteredItems = vehiculos.filter(
    (vehiculo) => vehiculo.brand && vehiculo.brand.toLowerCase().includes(filterText.toLowerCase())
  );

  const columns = [
    /*{
      name: 'ID',
      selector: (row) => row.id_vehicle,
      sortable: true,
    },*/
    {
      name: 'Marca',
      selector: (row) => row.brand,
      sortable: true,
    },
    {
      name: 'Modelo',
      selector: (row) => row.model,
      sortable: true,
    },
    {
      name: 'Placas',
      selector: (row) => row.plates,
      sortable: true,
    },
    {
      name: 'Color',
      selector: (row) => row.color,
      sortable: true,
    },
    {
      name: 'Serial',
      selector: (row) => row.serial,
      sortable: true,
    },
    {
      name: 'Estado',
      selector: (row) => row.status,
      sortable: true,
    },
    {
      name: 'Acciones',
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 transition"
            onClick={() => {
              setVehiculoEditado(row);
              setModalType('edit');
            }}
          >
            <FaEdit />
          </button>
          <button
            className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition"
            onClick={() => {
              setVehiculoSeleccionado(row);
              setModalType('delete');
            }}
          >
            <FaTrash />
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
          placeholder="Buscar por marca..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>
      <DataTable
        columns={columns}
        data={filteredItems}
        pagination
        fixedHeader
        highlightOnHover
        noDataComponent={<p className="text-gray-500">No hay datos disponibles.</p>}
      />
    </div>
  );
};

export default VehiculosList;
