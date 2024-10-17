import React, { useState } from 'react';
import DataTable from 'react-data-table-component';

function ClienteList({ clientes, setClienteEditado, setModalType, setClienteSeleccionado }) {
  const [filterText, setFilterText] = useState('');

  const filteredClientes = clientes.filter(
    (cliente) => cliente.name && cliente.name.toLowerCase().includes(filterText.toLowerCase())
  );

  const columns = [
    {
      name: 'Nombre',
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: 'Teléfono',
      selector: (row) => row.phone,
      sortable: true,
    },
    {
      name: 'Email',
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: 'RFC',
      selector: (row) => row.rfc,
      sortable: true,
    },
    {
      name: 'Fecha de Registro',
      selector: (row) => row.registrationDate,
      sortable: true,
    },
    {
      name: 'Acciones',
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 transition"
            onClick={() => {
              setClienteEditado(row);
              setModalType('edit');
            }}>
            Editar
          </button>
          <button
            className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition"
            onClick={() => {
              setClienteSeleccionado(row);
              setModalType('delete');
            }}>
            Eliminar
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 relative z-0"> {/* Asegura que la tabla tenga un z-index bajo */}
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
        data={filteredClientes}
        pagination
        fixedHeader
        highlightOnHover
        noDataComponent={<p className="text-center text-gray-500 dark:text-gray-400">No hay clientes registrados.</p>}
      />
    </div>
  );
}

export default ClienteList;
