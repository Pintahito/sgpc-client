import React, { useState } from 'react';
import DataTable from 'react-data-table-component';

function MaintenanceList({ maintenances, setMaintenanceEditado, setModalType, setMaintenanceSeleccionado }) {
  const [filterText, setFilterText] = useState('');

  // Filter maintenance records by description (or another attribute you prefer)
  const filteredMaintenance = maintenances.filter(
    (maintenance) => maintenance.description && maintenance.description.toLowerCase().includes(filterText.toLowerCase())
  );

  const columns = [
    /*
    {
      name: 'ID Mantenimiento',
      selector: (row) => row.idMaintenance,
      sortable: true,
    },
    */
    {
      name: 'Tipo de Mantenimiento',
      selector: (row) => row.maintenanceType,
      sortable: true,
    },
    {
      name: 'Empleado Asignado',
      selector: (row) => row.nameEmployee, // assuming you include employee name in the record
      sortable: true,
    },
    {
      name: 'Descripción',
      selector: (row) => row.description,
      sortable: true,
    },
    {
      name: 'Costo',
      selector: (row) => row.cost,
      sortable: true,
    },
    {
        name: 'Tipo',
        selector: (row) => row.relatedEntityType,
        sortable: true,
      },
    {
      name: 'Acciones',
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            className="bg-blue-500 text-white py-1 px-2 rounded-md hover:bg-blue-600 transition"
            onClick={() => {
              setMaintenanceEditado(row);
              setModalType('edit');
            }}
          >
            Editar
          </button>
          <button
            className="bg-red-500 text-white py-1 px-2 rounded-md hover:bg-red-600 transition"
            onClick={() => {
              setMaintenanceSeleccionado(row);
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
          placeholder="Buscar por descripción..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>
      <DataTable
        columns={columns}
        data={filteredMaintenance}
        pagination
        fixedHeader
        highlightOnHover
        noDataComponent={<p className="text-center text-gray-500 dark:text-gray-400">No hay registros de mantenimiento.</p>}
      />
    </div>
  );
}

export default MaintenanceList;
