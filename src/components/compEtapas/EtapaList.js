import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';

function EtapaList({ etapas, setEtapaEditada, setModalType, setEtapaSeleccionada }) {
  const [filterText, setFilterText] = useState('');
  const [filteredEtapas, setFilteredEtapas] = useState(etapas);

  // Filtrado sin debounce
  useEffect(() => {
    const filteredData = etapas.filter(
      (etapa) => etapa.name && etapa.name.toLowerCase().includes(filterText.toLowerCase())
    );
    setFilteredEtapas(filteredData);
  }, [filterText, etapas]);

  const columns = [
    {
      name: 'Nombre',
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: 'Descripción',
      selector: (row) => row.description,
      sortable: true,
    },
    {
      name: 'Fecha De Creación',
      selector: (row) => row.createdDate,
      sortable: true,
    },
    {
      name: 'Fecha De Modificación',
      selector: (row) => row.lastModifiedDate,
      sortable: true,
    },
    {
      name: 'Acciones',
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 transition"
            onClick={() => {
              setEtapaEditada(row);
              setModalType('edit');
            }}
          >
            Editar
          </button>
          <button
            className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition"
            onClick={() => {
              setEtapaSeleccionada(row);
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
          className="w-full p-2 border border-gray-300 rounded-md text-black dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Buscar por nombre..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>
      <DataTable
        columns={columns}
        data={filteredEtapas}
        pagination
        fixedHeader
        highlightOnHover
        noDataComponent={<p className="text-center text-gray-500 dark:text-gray-400">No hay etapas registradas.</p>}
      />
    </div>
  );
}

export default EtapaList;
