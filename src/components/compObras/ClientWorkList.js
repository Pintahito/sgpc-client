import React, { useState, useEffect, useCallback } from "react";
import DataTable from "react-data-table-component";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import Modal from "./Modal";

const ClientWorkList = ({ apiUrl, workId, reloadClientWorks, onEditClientWork }) => {
  const [clientWorks, setClientWorks] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    clientWork: null,
  }); 

  const fetchClientWorks = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/works/${workId}/client-works`);
      setClientWorks(response.data);
    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar las relaciones cliente-obra.", "error");
      console.error("Error al cargar las relaciones cliente-obra:", error);
    }
  }, [apiUrl, workId]);

  useEffect(() => {
    if (workId) {
      fetchClientWorks();
    }
  }, [fetchClientWorks, workId, reloadClientWorks]); // Agregar reloadClientWorks como dependencia

  const filteredClientWorks = clientWorks.filter(
    (item) =>
      item.nameClient.toLowerCase().includes(filterText.toLowerCase()) ||
      item.nameWork.toLowerCase().includes(filterText.toLowerCase())
  );

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${apiUrl}/api/v1/works/${workId}/work-client/${deleteModal.clientWork.id}`
      );

      Swal.fire("¡Eliminado!", "La relación cliente-obra ha sido eliminada.", "success");
      setDeleteModal({ isOpen: false, clientWork: null });
      fetchClientWorks(); 
    } catch (error) {
      Swal.fire("Error", "No se pudo eliminar la relación cliente-obra.", "error");
      console.error("Error al eliminar:", error);
    }
  };

  const columns = [
    { name: "Cliente", selector: (row) => row.nameClient, sortable: true },
    { name: "Obra", selector: (row) => row.nameWork, sortable: true },
    { name: "Rol", selector: (row) => row.role, sortable: true },
    {
      name: "Fecha de Asignación",
      selector: (row) => new Date(row.assignedAt).toLocaleString(),
      sortable: true,
    },
    { name: "Estado", selector: (row) => row.status, sortable: true },
    {
      name: "Acciones",
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            className="bg-blue-500 text-white p-1 rounded-md hover:bg-blue-600 transition flex items-center justify-center"
            onClick={() => onEditClientWork(row)} // Llama la función para editar
            title="Editar"
          >
            <FaEdit />
          </button>
          <button
            className="bg-red-500 text-white p-1 rounded-md hover:bg-red-600 transition flex items-center justify-center"
            onClick={() =>
              setDeleteModal({
                isOpen: true,
                clientWork: row,
              })
            } 
            title="Borrar"
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-white">Asignación Cliente-Obra</h2>
      <div className="mb-4">
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md text-black dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Buscar cliente u obra..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>
      <DataTable
        columns={columns}
        data={filteredClientWorks}
        pagination
        fixedHeader
        highlightOnHover
        noDataComponent={<p className="text-center text-gray-500">No se encontraron relaciones cliente-obra.</p>}
      />

      {/* Modal de eliminación */}
      {deleteModal.isOpen && (
        <Modal closeModal={() => setDeleteModal({ isOpen: false, clientWork: null })}>
          <div className="text-center">
            <p className="mb-4">
              ¿Estás seguro de que deseas eliminar la relación cliente-obra con el cliente{" "}
              <strong>{deleteModal.clientWork?.nameClient}</strong>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition"
                onClick={handleDelete}
              >
                Eliminar
              </button>
              <button
                className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition"
                onClick={() => setDeleteModal({ isOpen: false, clientWork: null })}
              >
                Cancelar
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ClientWorkList;