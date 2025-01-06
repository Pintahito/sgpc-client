import React, { useState } from 'react';
import DataTable from 'react-data-table-component';

function MaquinariaList({ maquinarias, setMaquinariaEditada, setModalType, setMaquinariaSeleccionada }) {
  const [filterText, setFilterText] = useState('');

  const filteredMaquinarias = maquinarias.filter(
    (maquinaria) => maquinaria.name && maquinaria.name.toLowerCase().includes(filterText.toLowerCase())
  );

  const columns = [
    {
      name: 'Nombre',
      selector: (row) => row.id_machinery,
      sortable: true,
    },
    {
      name: 'Nombre',
      selector: (row) => row.name,
      sortable: true,
    },
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
              setMaquinariaEditada(row);
              setModalType('edit');
            }}
          >
            Editar
          </button>
          <button
            className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition"
            onClick={() => {
              setMaquinariaSeleccionada(row);
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
          placeholder="Buscar por nombre..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>
      <DataTable
        columns={columns}
        data={filteredMaquinarias}
        pagination
        fixedHeader
        highlightOnHover
        noDataComponent={<p className="text-gray-500">No hay datos disponibles.</p>}
      />
    </div>
  );
}

export default MaquinariaList;
