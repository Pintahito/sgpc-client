import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';

function EmpleadoList({ empleados, setEmpleadoEditado, setModalType, setEmpleadoSeleccionado }) {
    const [filterText, setFilterText] = useState('');
    const [filteredEmpleados, setFilteredEmpleados] = useState(empleados);

    useEffect(() => {
        const filteredData = empleados.filter(
            (empleado) => empleado.name && empleado.name.toLowerCase().includes(filterText.toLowerCase())
        );
        setFilteredEmpleados(filteredData);
    }, [filterText, empleados]);

    const columns = [
        {
            name: 'Nombre',
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: 'RFC',
            selector: (row) => row.rfc,
            sortable: true,
        },
        {
            name: 'Email',
            selector: (row) => row.email,
            sortable: true,
        },

        {
            name: 'Fecha Contratacion',
            selector: (row) => row.hiringDate,
            sortable: true,
        },

        {
            name: 'Tipo Empleado',
            selector: (row) => row.employeeType,
            sortable: true,
        },
        {
            name: 'Acciones',
            cell: (row) => (
                <div className="flex space-x-2">
                    <button 
                    disabled
                        className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 transition"
                        onClick={() => {
                            setEmpleadoEditado(row);
                            setModalType('edit');
                        }}
                    >
                        Editar
                    </button>
                    <button
                        className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition"
                        onClick={() => {
                            setEmpleadoSeleccionado(row);
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
                data={filteredEmpleados}
                pagination
                fixedHeader
                highlightOnHover
                noDataComponent={<p className="text-center text-gray-500 dark:text-gray-400">No hay empleados registrados.</p>}
            />
        </div>
    );
}

export default EmpleadoList;
