import React, { useState } from "react";
import {
  FaCalendarAlt,
  FaFileAlt,
  FaArrowLeft,
  FaInfoCircle,
  FaPlus,
} from "react-icons/fa";
import ScheduledActivityList from "../compSchedule/ScheduledActivityList";
import ScheduledActivityForm from "../compSchedule/ScheduledActivityForm";
import Modal from "./Modal";
import axios from "axios";
import Swal from "sweetalert2";

const ScheduleView = ({ onBack, schedule, obra, apiUrl, onActivityView }) => {
  const [reloadActivities, setReloadActivities] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const formatDate = (date) => {
    if (!date) return "No disponible";
    return new Intl.DateTimeFormat("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  };

  const handleAddActivity = async (activityData) => {
    try {
      await axios.post(
        `${apiUrl}/api/v1/works/${obra.idWork}/schedule/activities`,
        activityData
      );
      Swal.fire({
        icon: "success",
        title: "Actividad agregada",
        text: "La actividad programada se agregó con éxito.",
        timer: 3000,
        timerProgressBar: true,
      });
      setReloadActivities((prev) => !prev); // Recargar actividades
      setIsFormModalOpen(false); // Cerrar modal
    } catch (error) {
      console.error("Error al agregar la actividad programada:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al agregar la actividad programada. Por favor, intenta de nuevo.",
        confirmButtonText: "Cerrar",
      });
    }
  };

  if (!schedule) {
    return (
      <div className="p-6 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Detalles del cronograma</h1>
        <p className="text-lg">No se encontró el cronograma seleccionado.</p>
        <button
          className="mt-4 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition"
          onClick={onBack}
        >
          <FaArrowLeft className="mr-2" /> Regresar
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white min-h-screen">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6 text-center border-b pb-4 text-gray-800 dark:text-white">
          Detalles del Cronograma
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-lg font-semibold flex items-center">
              <FaFileAlt className="mr-2 text-blue-500" /> Nombre:
            </p>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              {schedule.name}
            </p>
          </div>
          <div>
            <p className="text-lg font-semibold flex items-center">
              <FaFileAlt className="mr-2 text-blue-500" /> Descripción:
            </p>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              {schedule.description}
            </p>
          </div>
          <div>
            <p className="text-lg font-semibold flex items-center">
              <FaCalendarAlt className="mr-2 text-green-500" /> Fecha de
              creación:
            </p>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              {formatDate(schedule.created_at)}
            </p>
          </div>
          <div>
            <p className="text-lg font-semibold flex items-center">
              <FaCalendarAlt className="mr-2 text-green-500" /> Última
              actualización:
            </p>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              {formatDate(schedule.lastModifiedDate)}
            </p>
          </div>
          <div>
            <p className="text-lg font-semibold flex items-center">
              <FaInfoCircle className="mr-2 text-purple-500" /> Estado:
            </p>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              {schedule.status}
            </p>
          </div>

          <div className="col-span-2 mt-6">
            <div className="flex justify-between items-center">
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition flex items-center gap-2"
                onClick={() => setIsFormModalOpen(true)}
              >
                <FaPlus /> Agregar Actividad
              </button>
            </div>

            <ScheduledActivityList
              apiUrl={apiUrl}
              workId={obra.idWork}
              reloadActivities={reloadActivities}
              onActivityView={onActivityView} // Pasa la función desde el componente padre
            />
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-4">
          <button
            className="bg-gray-500 text-white py-2 px-6 rounded-md hover:bg-gray-600 transition flex items-center gap-2"
            onClick={onBack}
          >
            <FaArrowLeft /> Volver a obra
          </button>
        </div>
      </div>

      {isFormModalOpen && (
        <Modal closeModal={() => setIsFormModalOpen(false)}>
          <ScheduledActivityForm
            activity={{}}
            setActivity={() => {}}
            onSave={handleAddActivity}
            closeModal={() => setIsFormModalOpen(false)}
            apiUrl={apiUrl}
          />
        </Modal>
      )}
    </div>
  );
};

export default ScheduleView;
