import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { FaEdit, FaTrash} from "react-icons/fa";

function EmpleadoPlantaList({ empleadosP, setEmpleadoEditadoP, setModalType, setEmpleadoSeleccionadoP}) {
    const [filterText, setFilterText] = useState('');
    const [filteredEmpleados, setFilteredEmpleados] = useState([]);

    useEffect(() => {
        const filteredData = empleadosP.filter(
            (empleadoP) => 
                empleadoP.employeeType === 'PLANTA' && 
                empleadoP.name && 
                empleadoP.name.toLowerCase().includes(filterText.toLowerCase())
        );
        setFilteredEmpleados(filteredData);
    }, [filterText, empleadosP]);

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
                        className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 transition"
                        onClick={() => {
                            setEmpleadoEditadoP(row);
                            setModalType('edit');
                        }}
                    >
                        <FaEdit />
                    </button>
                    <button
                        className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition"
                        onClick={() => {
                            setEmpleadoSeleccionadoP(row);
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
                data={filteredEmpleados}
                pagination
                fixedHeader
                highlightOnHover
                noDataComponent={<p className="text-center text-gray-500 dark:text-gray-400">No hay empleados registrados.</p>}
            />
        </div>
    );
}

export default EmpleadoPlantaList;
