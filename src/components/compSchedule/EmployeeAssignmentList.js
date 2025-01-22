import React, { useState, useEffect, useCallback } from "react";
import DataTable from "react-data-table-component";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import Modal from "./Modal";
import EmployeeAssignmentForm from "./EmployeeAssignmentForm";

const EmployeeAssignmentList = ({ apiUrl, reloadAssignments, scheduledActivityId }) => {
  const [assignments, setAssignments] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    assignment: null,
  });
  const [editModal, setEditModal] = useState({
    isOpen: false,
    assignment: null,
  });

  // Fetch assignments
  const fetchAssignments = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/scheduled-activities/${scheduledActivityId}/assignments`);
      setAssignments(response.data);
    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar las asignaciones.", "error");
      console.error("Error al cargar asignaciones:", error);
    }
  }, [apiUrl, scheduledActivityId]);

  // Reload assignments on changes
  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments, reloadAssignments]);

  const filteredAssignments = assignments.filter((assignment) =>
    assignment.nameEmployee.toLowerCase().includes(filterText.toLowerCase())
  );

  // Delete assignment
  const handleDelete = async () => {
    try {
      await axios.delete(
        `${apiUrl}/api/v1/scheduled-activities/${scheduledActivityId}/assignment-employee/${deleteModal.assignment.activityAssignmentId}`
      );

      Swal.fire("¡Eliminado!", "La asignación ha sido eliminada.", "success");
      setDeleteModal({ isOpen: false, assignment: null }); // Cerrar modal
      fetchAssignments(); // Refrescar la lista
      if (deleteModal.assignment.responsible) {
        // Informar al componente padre que actualice el estado de `hasResponsible`
        reloadAssignments(); // Llama a la función pasada como prop
      }
    } catch (error) {
      Swal.fire("Error", "No se pudo eliminar la asignación.", "error");
      console.error("Error al eliminar:", error);
    }
  };

  // Save edited assignment
  const handleSaveEdit = async (updatedAssignment) => {
    try {
      await axios.put(
        `${apiUrl}/api/v1/scheduled-activities/${scheduledActivityId}/assignment-employee/${editModal.assignment.activityAssignmentId}`,
        updatedAssignment
      );
      Swal.fire("¡Editado!", "La asignación ha sido actualizada con éxito.", "success");
      setEditModal({ isOpen: false, assignment: null }); // Cerrar modal
      fetchAssignments(); // Refrescar la lista
    } catch (error) {
      Swal.fire("Error", "No se pudo actualizar la asignación.", "error");
      throw error; // Esto asegura que el error se propague y no se cierre el modal
    }
  };

  // Table columns
  const columns = [
    { name: "Empleado", selector: (row) => row.nameEmployee, sortable: true },
    { name: "Rol", selector: (row) => row.role, sortable: true },
    {
      name: "Responsable",
      selector: (row) => (row.responsible ? "Sí" : "No"),
      sortable: true,
    },
    { name: "Estado", selector: (row) => row.status, sortable: true },
    {
      name: "Creación",
      selector: (row) =>
        row.createdDate ? new Date(row.createdDate).toLocaleDateString() : "N/A",
      sortable: true,
    },
    {
      name: "Última Modificación",
      selector: (row) =>
        row.lastModifiedDate
          ? new Date(row.lastModifiedDate).toLocaleDateString()
          : "N/A",
      sortable: true,
    },
    {
      name: "Acciones",
      cell: (row) => (
        <div className="flex space-x-1">
          {/* Editar */}
          <button
            className="bg-blue-500 text-white p-1 rounded-md hover:bg-blue-600 transition flex items-center justify-center"
            onClick={() =>
              setEditModal({
                isOpen: true,
                assignment: row, // Pasar asignación seleccionada para editar
              })
            }
            title="Editar"
          >
            <FaEdit />
          </button>
          {/* Eliminar */}
          <button
            className="bg-red-500 text-white p-1 rounded-md hover:bg-red-600 transition flex items-center justify-center"
            onClick={() =>
              setDeleteModal({
                isOpen: true,
                assignment: row, // Establecer la asignación seleccionada
              })
            }
            title="Eliminar"
          >
            <FaTrash />
          </button>
          
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="mb-4">
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md text-black"
          placeholder="Buscar por nombre de empleado..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>
      <DataTable
        columns={columns}
        data={filteredAssignments}
        pagination
        fixedHeader
        highlightOnHover
        noDataComponent={
          <p className="text-center text-gray-500">
            No se encontraron asignaciones.
          </p>
        }
      />

      {/* Modal de eliminación */}
      {deleteModal.isOpen && (
        <Modal closeModal={() => setDeleteModal({ isOpen: false, assignment: null })}>
          <div className="text-center">
            <p className="mt-3">
              ¿Estás seguro de que deseas eliminar la asignación de{" "}
              <strong>{deleteModal.assignment?.nameEmployee}</strong>?
            </p>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                onClick={handleDelete}
              >
                Eliminar
              </button>
              <button
                className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
                onClick={() => setDeleteModal({ isOpen: false, assignment: null })}
              >
                Cancelar
              </button>
            </div>
          </div>
        </Modal>
      )}

       {/* Modal de edición */}
       {editModal.isOpen && (
        <Modal closeModal={() => setEditModal({ isOpen: false, assignment: null })}>
          <EmployeeAssignmentForm
            onSave={handleSaveEdit}
            closeModal={() => setEditModal({ isOpen: false, assignment: null })}
            apiUrl={apiUrl}
            assignment={editModal.assignment}
          />
        </Modal>
      )}
    </div>
  );
};

export default EmployeeAssignmentList;