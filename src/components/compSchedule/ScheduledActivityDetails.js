import React, { useState, useEffect, useCallback } from "react";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaInfoCircle,
  FaFlag,
  FaCheckCircle,
  FaPlus,
} from "react-icons/fa";
import EmployeeAssignmentList from "./EmployeeAssignmentList"; // Componente para listar asignaciones
import EmployeeAssignmentForm from "./EmployeeAssignmentForm"; // Componente para agregar empleados
import Modal from "./Modal";
import axios from "axios";
import Swal from "sweetalert2";

const ScheduledActivityDetails = ({ activity, onBack, apiUrl }) => {
  const [reloadAssignments, setReloadAssignments] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [hasResponsible, setHasResponsible] = useState(false);

  // Formatear fecha
  const formatDate = (date) => {
    if (!date) return "No disponible";
    return new Intl.DateTimeFormat("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  };

  // Convertir prioridad a texto
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

  // Actualizar el estado de `hasResponsible` desde la API
  const fetchResponsibleStatus = useCallback(async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/v1/scheduled-activities/${activity.scheduledActivityId}/has-responsible`
      );
      setHasResponsible(response.data.hasResponsible); // Actualiza el estado
    } catch (error) {
      console.error("Error al verificar responsables:", error);
    }
  }, [apiUrl, activity.scheduledActivityId]);

  // Llamar al estado inicial y cuando `reloadAssignments` cambie
  useEffect(() => {
    fetchResponsibleStatus();
  }, [fetchResponsibleStatus, reloadAssignments]);

  // Manejar la creación de una nueva asignación
  const handleAddAssignment = async (assignmentData) => {
    try {
      await axios.post(
        `${apiUrl}/api/v1/scheduled-activities/${activity.scheduledActivityId}/assignment-employee`,
        assignmentData
      );
      Swal.fire({
        icon: "success",
        title: "Empleado asignado",
        text: "El empleado ha sido asignado correctamente.",
        timer: 3000,
        timerProgressBar: true,
      });

      setReloadAssignments((prev) => !prev); // Recargar lista de asignaciones
      setIsFormModalOpen(false); // Cerrar modal
    } catch (error) {
      console.error("Error al asignar empleado:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al asignar el empleado. Por favor, inténtelo de nuevo.",
        confirmButtonText: "Cerrar",
      });
    }
  };

  // Manejar la eliminación de una asignación
  const handleDeleteAssignment = async (assignmentId) => {
    try {
      await axios.delete(
        `${apiUrl}/api/v1/scheduled-activities/${activity.scheduledActivityId}/assignment-employee/${assignmentId}`
      );
      Swal.fire({
        icon: "success",
        title: "Asignación eliminada",
        text: "La asignación se eliminó correctamente.",
        timer: 3000,
        timerProgressBar: true,
      });

      // Actualizar lista y estado de responsables
      setReloadAssignments((prev) => !prev);
      await fetchResponsibleStatus();
    } catch (error) {
      console.error("Error al eliminar asignación:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo eliminar la asignación. Por favor, inténtelo de nuevo.",
        confirmButtonText: "Cerrar",
      });
    }
  };

  // Manejar la apertura del modal para agregar asignación
  const handleOpenAddModal = async () => {
    await fetchResponsibleStatus(); // Asegurarse de que `hasResponsible` esté actualizado
    setIsFormModalOpen(true); // Abrir modal
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white min-h-screen">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6 text-center border-b pb-4 text-gray-800 dark:text-white">
          Detalles de la Actividad
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Detalles de la actividad */}
          <div>
            <p className="text-lg font-semibold flex items-center">
              <FaInfoCircle className="mr-2 text-blue-500" /> Nombre de la Actividad:
            </p>
            <p className="mb-4 text-gray-700 dark:text-gray-300">{activity.nameActivity}</p>
          </div>
          <div>
            <p className="text-lg font-semibold flex items-center">
              <FaCalendarAlt className="mr-2 text-green-500" /> Fecha Inicio Estimada:
            </p>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              {formatDate(activity.estimatedStartDate)}
            </p>
          </div>
          <div>
            <p className="text-lg font-semibold flex items-center">
              <FaCalendarAlt className="mr-2 text-red-500" /> Fecha Fin Estimada:
            </p>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              {formatDate(activity.estimatedEndDate)}
            </p>
          </div>
          <div>
            <p className="text-lg font-semibold flex items-center">
              <FaFlag className="mr-2 text-yellow-500" /> Prioridad:
            </p>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              {priorityToText(activity.priority)}
            </p>
          </div>
          <div className="md:col-span-2">
            <p className="text-lg font-semibold flex items-center">
              <FaCheckCircle className="mr-2 text-purple-500" /> Estado:
            </p>
            <p className="mb-4 text-gray-700 dark:text-gray-300">{activity.status}</p>
          </div>
        </div>

        {/* Lista de asignaciones de empleados */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-white">Asignaciones de Empleados</h2>
          <div className="flex justify-between items-center mb-4">
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition flex items-center gap-2"
              onClick={handleOpenAddModal}
            >
              <FaPlus /> Agregar Empleado
            </button>
          </div>
          <EmployeeAssignmentList
            apiUrl={apiUrl}
            scheduledActivityId={activity.scheduledActivityId}
            reloadAssignments={() => setReloadAssignments((prev) => !prev)}
            onDeleteAssignment={handleDeleteAssignment} // Prop para manejar eliminación
          />
        </div>

        {/* Botón para volver */}
        <div className="mt-6 flex justify-center">
          <button
            className="bg-gray-500 text-white py-2 px-6 rounded-md hover:bg-gray-600 transition flex items-center gap-2"
            onClick={onBack}
          >
            <FaArrowLeft /> Volver
          </button>
        </div>
      </div>

      {/* Modal para agregar empleado */}
      {isFormModalOpen && (
        <Modal closeModal={() => setIsFormModalOpen(false)}>
          <EmployeeAssignmentForm
            onSave={handleAddAssignment}
            closeModal={() => setIsFormModalOpen(false)}
            apiUrl={apiUrl}
            hasResponsible={hasResponsible}
          />
        </Modal>
      )}
    </div>
  );
};

export default ScheduledActivityDetails;