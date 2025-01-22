import React, { useState, useEffect, useCallback } from "react";
import DataTable from "react-data-table-component";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import Modal from "./Modal"; // Importar el componente Modal predefinido
import ScheduledActivityForm from "../compSchedule/ScheduledActivityForm"; // Importar el formulario

const ScheduledActivityList = ({ apiUrl, workId, reloadActivities, onActivityView }) => {
  const [activities, setActivities] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    activity: null,
  });
  const [editModal, setEditModal] = useState({
    isOpen: false,
    activity: null,
  });

  // Fetch activities
  const fetchActivities = useCallback(async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/v1/works/${workId}/schedule/activities`
      );
      setActivities(response.data);
    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar las actividades programadas.", "error");
      console.error("Error al cargar actividades:", error);
    }
  }, [apiUrl, workId]);

  // Reload activities on changes
  useEffect(() => {
    if (workId) {
      fetchActivities();
    }
  }, [fetchActivities, workId, reloadActivities]);

  // Filtered activities
  const filteredActivities = activities.filter((activity) =>
    activity.nameActivity.toLowerCase().includes(filterText.toLowerCase())
  );

  // Delete activity
  const handleDelete = async () => {
    try {
      await axios.delete(
        `${apiUrl}/api/v1/works/${workId}/schedule/activities/${deleteModal.activity.scheduledActivityId}`
      );

      Swal.fire("¡Eliminado!", "La actividad programada ha sido eliminada.", "success");
      setDeleteModal({ isOpen: false, activity: null }); // Cerrar modal
      fetchActivities(); // Refrescar la lista
    } catch (error) {
      Swal.fire("Error", "No se pudo eliminar la actividad programada.", "error");
      console.error("Error al eliminar:", error);
    }
  };

  // Save edited activity
  const handleSaveEdit = async (updatedActivity) => {
    try {
      await axios.put(
        `${apiUrl}/api/v1/works/${workId}/schedule/activities/${editModal.activity.scheduledActivityId}`,
        updatedActivity
      );
      Swal.fire("¡Editado!", "La actividad ha sido actualizada con éxito.", "success");
      setEditModal({ isOpen: false, activity: null }); // Cerrar modal
      fetchActivities(); // Refrescar la lista
    } catch (error) {
      Swal.fire("Error", "No se pudo actualizar la actividad programada.", "error");
      console.error("Error al editar:", error);
    }
  };

  // Convert priority number to text
  const priorityToText = (priority) => {
    switch (priority) {
      case 1:
        return "Baja";
      case 2:
        return "Media";
      case 3:
        return "Alta";
      default:
        return "Desconocida";
    }
  };

  // Get CSS class for priority background color
  const getPriorityClass = (priority) => {
    switch (priority) {
      case 1:
        return "bg-green-100 text-green-700"; // Baja - Verde
      case 2:
        return "bg-yellow-100 text-yellow-700"; // Media - Amarillo
      case 3:
        return "bg-red-100 text-red-700"; // Alta - Rojo
      default:
        return "bg-gray-100 text-gray-700"; // Desconocida - Gris
    }
  };

  // Table columns
  const columns = [
    { name: "Actividad", selector: (row) => row.nameActivity, sortable: true },
    {
      name: "Fecha Inicio Estimada",
      selector: (row) =>
        row.estimatedStartDate ? new Date(row.estimatedStartDate).toLocaleDateString() : "N/A",
      sortable: true,
    },
    {
      name: "Fecha Fin Estimada",
      selector: (row) =>
        row.estimatedEndDate ? new Date(row.estimatedEndDate).toLocaleDateString() : "N/A",
      sortable: true,
    },
    {
      name: "Prioridad",
      cell: (row) => (
        <span
          className={`px-2 py-1 rounded-md font-semibold ${getPriorityClass(
            row.priority
          )}`}
        >
          {priorityToText(row.priority)}
        </span>
      ),
      sortable: true,
    },
    { name: "Estado", selector: (row) => row.status, sortable: true },
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
                activity: row, // Pasar actividad seleccionada para editar
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
                activity: row, // Establecer la actividad seleccionada
              })
            }
            title="Eliminar"
          >
            <FaTrash />
          </button>
          {/* Ver Detalles */}
          <button
            className="bg-green-500 text-white p-1 rounded-md hover:bg-green-600 transition flex items-center justify-center"
            onClick={() => onActivityView(row)} // Llama a la función `onActivityView`
            title="Ver"
          >
            <FaEye />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-white">Actividades Programadas</h2>
      <div className="mb-4">
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md text-black dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Buscar actividad..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>
      <DataTable
        columns={columns}
        data={filteredActivities}
        pagination
        fixedHeader
        highlightOnHover
        noDataComponent={
          <p className="text-center text-gray-500">
            No se encontraron actividades programadas.
          </p>
        }
      />

      {/* Modal de eliminación */}
      {deleteModal.isOpen && (
        <Modal closeModal={() => setDeleteModal({ isOpen: false, activity: null })}>
          <div className="text-center">
            <p className="mt-3">
              ¿Estás seguro de que deseas eliminar la actividad{" "}
              <strong>{deleteModal.activity?.nameActivity}</strong>?
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
                onClick={() => setDeleteModal({ isOpen: false, activity: null })}
              >
                Cancelar
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal de edición */}
      {editModal.isOpen && (
        <Modal closeModal={() => setEditModal({ isOpen: false, activity: null })}>
          <ScheduledActivityForm
            scheduledActivity={editModal.activity} // Pasar actividad seleccionada para editar
            setScheduledActivity={(updatedActivity) =>
              setEditModal((prev) => ({ ...prev, activity: updatedActivity }))
            }
            onSave={handleSaveEdit} // Función para guardar cambios
            closeModal={() => setEditModal({ isOpen: false, activity: null })} // Cerrar modal
            apiUrl={apiUrl} // Asegúrate de pasar `apiUrl`
          />
        </Modal>
      )}
    </div>
  );
};

export default ScheduledActivityList;