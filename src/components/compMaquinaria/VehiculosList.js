import React, { useState } from 'react';
import DataTable from 'react-data-table-component';

const VehiculosList = ({ vehiculos, setVehiculoEditado, setModalType, setVehiculoSeleccionado }) => {
  const [filterText, setFilterText] = useState('');

  const filteredItems = vehiculos.filter(
    (vehiculo) => vehiculo.marca && vehiculo.marca.toLowerCase().includes(filterText.toLowerCase())
  );

  const columns = [
    {
      name: 'Marca',
      selector: (row) => row.marca,
      sortable: true,
    },
    {
      name: 'Modelo',
      selector: (row) => row.modelo,
      sortable: true,
    },
    {
      name: 'Placas',
      selector: (row) => row.placas,
      sortable: true,
    },
    {
      name: 'Color',
      selector: (row) => row.color,
      sortable: true,
    },
    {
      name: 'Año',
      selector: (row) => row.ano,
      sortable: true,
    },
    {
      name: 'Serial',
      selector: (row) => row.serial,
      sortable: true,
    },
    {
      name: 'Estado',
      selector: (row) => row.estado,
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
            Editar
          </button>
          <button
            className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition"
            onClick={() => {
              setVehiculoSeleccionado(row);
              setModalType('delete');
            }}
          >
            Eliminar
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
          className="w-full p-2 border border-gray-300 rounded-md text-black"
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
