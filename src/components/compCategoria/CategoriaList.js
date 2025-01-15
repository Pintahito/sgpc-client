import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { FaEdit, FaTrash} from "react-icons/fa";

function CategoriaList({ categorias, setCategoriaEditada, setModalType, setCategoriaSeleccionada }) {
  const [filterText, setFilterText] = useState('');
  const [filteredCategorias, setFilteredCategorias] = useState(categorias);

  // Filtrado sin debounce
  useEffect(() => {
    const filteredData =categorias.filter(
      (categoria) => categoria.name && categoria.name.toLowerCase().includes(filterText.toLowerCase())
    );
    setFilteredCategorias(filteredData);
  }, [filterText, categorias]);

  const columns = [
    {
      name: 'Nombre',
      selector: (row) => row.name,
      sortable: true,
    },    {
      name: 'Descripcion',
      selector: (row) => row.description,
      sortable: true,
    },
    {
      name: 'Acciones',
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 transition"
            onClick={() => {
              setCategoriaEditada(row);
              setModalType('edit');
            }}
          >
            <FaEdit />
          </button>
          <button
            className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition"
            onClick={() => {
              setCategoriaSeleccionada(row);
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
          placeholder="Buscar por nombre..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>
      <DataTable
        columns={columns}
        data={filteredCategorias}
        pagination
        fixedHeader
        highlightOnHover
        noDataComponent={<p className="text-center text-gray-500 dark:text-gray-400">No hay categorias registradas.</p>}
      />
    </div>
  );
}

export default CategoriaList;