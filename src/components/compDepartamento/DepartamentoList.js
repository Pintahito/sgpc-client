import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import { FaEdit, FaTrash} from "react-icons/fa";

function DepartamentoList({ departamentos, setDepartamentoEditado, setModalType, setDepartamentoSeleccionado }) {
  const [filterText, setFilterText] = useState('');

  const filteredDepartamentos = departamentos.filter(
    (departamento) => departamento.name && departamento.name.toLowerCase().includes(filterText.toLowerCase())
  );

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
      name: 'Email',
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: 'Acciones',
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 transition"
            onClick={() => {
              setDepartamentoEditado(row);
              setModalType('edit');
            }}>
            <FaEdit />
          </button>
          <button
            className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition"
            onClick={() => {
              setDepartamentoSeleccionado(row);
              setModalType('delete');
            }}>
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
          placeholder="Buscar por nombre..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>
      <DataTable
        columns={columns}
        data={filteredDepartamentos}
        pagination
        fixedHeader
        highlightOnHover
        noDataComponent={<p className="text-center text-gray-500 dark:text-gray-400">No hay departamentos registrados.</p>}
      />
    </div>
  );
}

export default DepartamentoList;
