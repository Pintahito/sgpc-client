import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';

function BancoList({ bancos, setBancoEditado, setModalType, setBancoSeleccionado }) {
  const [filterText, setFilterText] = useState('');
  const [filteredBancos, setFilteredBancos] = useState(bancos);

  // Filtrado de bancos
  useEffect(() => {
    const filteredData = bancos.filter(
      (banco) => banco.name && banco.name.toLowerCase().includes(filterText.toLowerCase())
    );
    setFilteredBancos(filteredData);
  }, [filterText, bancos]);

  // Definición de columnas para la tabla
  const columns = [
    {
      name: 'Nombre del Banco',
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: 'Acciones',
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 transition"
            onClick={() => {
              setBancoEditado(row);
              setModalType('edit');
            }}
          >
            Editar
          </button>
          <button
            className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition"
            onClick={() => {
              setBancoSeleccionado(row);
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
          placeholder="Buscar por nombre del banco..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>
      <DataTable
        columns={columns}
        data={filteredBancos}
        pagination
        fixedHeader
        highlightOnHover
        noDataComponent={<p className="text-center text-gray-500 dark:text-gray-400">No hay bancos registrados.</p>}
      />
    </div>
  );
}

export default BancoList;
