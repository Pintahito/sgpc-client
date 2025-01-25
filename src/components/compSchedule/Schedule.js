import React, { useState, useEffect } from "react";
import axios from "axios";
import ScheduleList from "./ScheduleList";
import ScheduleForm from "../compObras/ScheduleForm"; 
import Modal from "./Modal"; 
import Swal from "sweetalert2";

const apiUrl = process.env.REACT_APP_API_URL;

const Schedule = () => {
  // Estados para Schedule
  const [schedules, setSchedules] = useState([]);
  const [scheduleEditada, setScheduleEditada] = useState(null);
  const [scheduleSeleccionada, setScheduleSeleccionada] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");

  // Funciones para Schedules
  const fetchSchedules = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/schedules`);
      setSchedules(response.data);
    } catch (error) {
      console.error("Error al obtener los cronogramas:", error);
    }
  };

  const saveSchedule = async (values) => {
    try {
      await axios.put(
        `${apiUrl}/api/v1/schedules/${scheduleEditada.idSchedule}`,
        values
      );
      Swal.fire({
        title: "¡Cronograma editado con éxito!",
        icon: "success",
        draggable: true,
      });
      fetchSchedules();
      closeModal();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error al editar el cronograma.",
      });
    }
  };

  const deleteSchedule = async () => {
    try {
      await axios.delete(
        `${apiUrl}/api/v1/schedules/${scheduleSeleccionada.idSchedule}`
      );
      Swal.fire({
        icon: "warning",
        title: "¡Cronograma eliminado con éxito!",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      fetchSchedules();
      closeDeleteModal();
    } catch (error) {
      if (error.response) {
        const { data } = error.response; 
        Swal.fire({
          icon: "error",
          title: "Error al eliminar", 
          text: data.message || "No se pudo eliminar el cronograma. Verifica si está siendo usado en otro lugar.", 
          confirmButtonText: "Entendido",
        });
      } else if (error.request) {
        Swal.fire({
          icon: "error",
          title: "Error de red", 
          text: "No se pudo establecer comunicación con el servidor. Verifica tu conexión a internet.",
          confirmButtonText: "Entendido",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error inesperado", 
          text: "Ocurrió un error inesperado. Por favor, intenta nuevamente.",
          confirmButtonText: "Entendido",
        });
      }
      console.error("Error al eliminar el cronograma:", error);
    }
  };

  // Cerrar modal de formulario
  const closeModal = () => {
    setIsModalOpen(false);
    setScheduleEditada(null);
  };

  // Cerrar modal de confirmación de eliminación
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setScheduleSeleccionada(null);
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-500 text-gray-800 dark:text-white">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Gestión de Cronogramas</h1>

      {/* Modal para editar horario */}
      {isModalOpen && modalType === "edit" && (
        <Modal closeModal={closeModal}>
          <ScheduleForm
            schedule={scheduleEditada || {}}
            onSave={saveSchedule}
            closeModal={closeModal}
          />
        </Modal>
      )}

      {/* Modal de confirmación de eliminación */}
      {isDeleteModalOpen && modalType === "delete" && (
        <Modal closeModal={closeDeleteModal}>
          <div className="text-center">
            <p className="mb-4 mt-4">
              ¿Estás seguro de que deseas eliminar el cronograma{" "}
              {scheduleSeleccionada?.name}?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition"
                onClick={deleteSchedule}
              >
                Eliminar
              </button>
              <button
                className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition"
                onClick={closeDeleteModal}
              >
                Cancelar
              </button>
            </div>
          </div>
        </Modal>
      )}

      <h2 className="text-2xl font-semibold mt-6 mb-4 dark:text-white">Lista de Cronogramas</h2>
      <ScheduleList
        schedules={schedules}
        setScheduleEditada={(schedule) => {
          setScheduleEditada(schedule);
          setModalType("edit");
          setIsModalOpen(true);
        }}
        setScheduleSeleccionada={(schedule) => {
          setScheduleSeleccionada(schedule);
          setModalType("delete");
          setIsDeleteModalOpen(true);
        }}
        setModalType={setModalType}
      />
    </div>
  );
};

export default Schedule;