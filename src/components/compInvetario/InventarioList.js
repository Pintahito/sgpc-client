import React, { useState} from 'react';
import DataTable from 'react-data-table-component';
import { FaEdit, FaTrash} from "react-icons/fa";

const apiUrl = process.env.REACT_APP_API_URL;
console.log(apiUrl);

function InventarioList({ inventario, setArticuloEditado, setModalType, setArticuloSeleccionado }) {
  const [filterText, setFilterText] = useState('');

  // Filtrar los artículos del inventario según el texto ingresado
  const filteredItems = inventario.filter(
    (articulo) => articulo.name && articulo.name.toLowerCase().includes(filterText.toLowerCase())
  );

  // Definición de columnas para la tabla
  const columns = [
    {
      name: 'Nombre',
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: 'Cantidad',
      selector: (row) => `${row.amount} ${row.unit || ''}`, // Combinar cantidad y unidad
      sortable: true,
    },
    {
      name: 'Precio',
      selector: (row) => `$${row.price.toFixed(2)}`,
      sortable: true,
    },
    {
      name: 'Descripción',
      selector: (row) => row.description,
      sortable: true,
    },
    {
      name: 'Tipo Insumo',
      selector: (row) => row.inputType,
      sortable: true,
    },
    {
      name: 'Bodega',
      selector: (row) => row.wineryName,
      sortable: true,
    },
    {
      name: 'Proveedor',
      selector: (row) => row.supplierNames || 'No disponible',
      sortable: true,
    },
    {
      name: 'Acciones',
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 transition"
            onClick={() => {
              setArticuloEditado(row);
              setModalType('edit');
            }}>
            <FaEdit />
          </button>
          <button
            className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition"
            onClick={() => {
              setArticuloSeleccionado(row);
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
          className="w-full p-2 border border-gray-300 rounded-md text-black"
          placeholder="Buscar por nombre..."
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
}

export default InventarioList;
