import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import { FaEdit, FaTrash} from "react-icons/fa";

const apiUrl = process.env.REACT_APP_API_URL;
console.log(apiUrl);

function UserList({ users, setUserEditado, setModalType, setUserSeleccionado }) {
  const [filterText, setFilterText] = useState('');

  const filteredUsers = users.filter(
    (user) => user.username && user.username.toLowerCase().includes(filterText.toLowerCase())
  );

  const columns = [
    {
      name: 'Usuario',
      selector: (row) => row.username,
      sortable: true,
    },
    {
      name: 'Rol',
      selector: (row) => row.rolName,
      sortable: true,
    },
      /*
    {
      name: 'Rol',
      selector: (row) => {
        const rol = roles.find((r) => r.rol_id === row.rolId);
        return rol ? rol.name : 'Desconocido';
      },
      sortable: true,
    },
    */
    {
      name: 'Acciones',
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 transition"
            onClick={() => {
              setUserEditado(row);
              setModalType('edit');
            }}>
            <FaEdit />
          </button>
          <button
            className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition"
            onClick={() => {
              setUserSeleccionado(row);
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
          placeholder="Buscar por usuario..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>
      <DataTable
        columns={columns}
        data={filteredUsers}
        pagination
        fixedHeader
        highlightOnHover
        noDataComponent={<p className="text-center text-gray-500 dark:text-gray-400">No hay usuarios registrados.</p>}
      />
    </div>
  );
}

export default UserList;
