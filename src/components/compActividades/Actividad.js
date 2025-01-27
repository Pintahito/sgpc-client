import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ActividadForm from './ActividadForm';
import ActividadList from './ActividadList';
import Modal from './Modal'; // Modal para agregar, editar y eliminar
import Swal from 'sweetalert2';

const apiUrl = process.env.REACT_APP_API_URL;
console.log(apiUrl);

const Actividad = () => {
  // Estados de Actividad
  const [actividades, setActividades] = useState([]);
  const [etapas, setEtapas] = useState([]);
  const [actividadEditada, setActividadEditada] = useState(null);
  const [actividadSeleccionada, setActividadSeleccionada] = useState(null);
  const [newActividad, setNewActividad] = useState({
    name: '',
    description: ''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');

  // Funciones para Actividades
  const fetchActividades = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/activities`);
      setActividades(response.data);
    } catch (error) {
      console.error('Error al obtener las actividades:', error);
    }
  };

  const fetchEtapas = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/stages`);
      setEtapas(response.data);
    } catch (error) {
      console.error('Error al obtener las etapas:', error);
    }
  };

  const saveActividad = async (values) => {
    try {
      if (actividadEditada) {
        await axios.put(`${apiUrl}/api/v1/activities/${actividadEditada.idActivity}`, values);
        Swal.fire({
          title: "¡Actividad editada con éxito!",
          icon: "success",
          draggable: true
        });
      } else {
        await axios.post(`${apiUrl}/api/v1/activities`, values);
        Swal.fire({
          title: "¡Actividad agregada con éxito!",
          icon: "success",
          draggable: true
        });
      }
      fetchActividades();
      closeModal();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error al guardar la actividad.",
      });
      console.error('Error al guardar actividad:', error);
    }
  };

  const deleteActividad = async () => {
    try {
      await axios.delete(`${apiUrl}/api/v1/activities/${actividadSeleccionada.idActivity}`);
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: "warning", // Cambiado para reflejar una acción de eliminación
        title: "Eliminación realizada con éxito" // Mensaje actualizado para eliminación
      });
      fetchActividades();
      closeDeleteModal();
    } catch (error) {
      console.error('Error al eliminar actividad:', error);
    }
  };

  // Cerrar modal de formulario
  const closeModal = () => {
    setIsModalOpen(false);
    setNewActividad({
      name: '',
      description: ''
    });
  };

  // Cerrar modal de confirmación de eliminación
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setActividadSeleccionada(null);
  };

  useEffect(() => {
    fetchActividades();
    fetchEtapas();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-500 text-gray-800 dark:text-white">
      <h1 className="text-3xl font-bold text-iosText dark:text-white mb-6">Gestión de Actividades</h1>

      <button
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
        onClick={() => {
          setModalType('add');
          setIsModalOpen(true);
        }}>
        Agregar Actividad
      </button>

      {/* Modal para agregar o editar actividad */}
      {isModalOpen && (modalType === 'add' || modalType === 'edit') && (
        <Modal closeModal={closeModal}>
          <ActividadForm
            actividad={newActividad}
            setActividad={setNewActividad}
            onSave={saveActividad}
            actividadEditada={actividadEditada}
            etapas={etapas}
            handleInputChange={(e) => setNewActividad({ ...newActividad, [e.target.name]: e.target.value })}
            closeModal={closeModal}
          />
        </Modal>
      )}

      {/* Modal de confirmación de eliminación */}
      {isDeleteModalOpen && modalType === 'delete' && (
        <Modal closeModal={closeDeleteModal}>
          <div className="text-center">
            <p className="mb-4">¿Estás seguro de que deseas eliminar la actividad {actividadSeleccionada?.name}?</p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition"
                onClick={deleteActividad}>
                Eliminar
              </button>
              <button
                className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition"
                onClick={closeDeleteModal}>
                Cancelar
              </button>
            </div>
          </div>
        </Modal>
      )}

      
      <ActividadList
        actividades={actividades}
        setActividadEditada={(actividad) => {
          setActividadEditada(actividad);
          setNewActividad(actividad);
          setModalType('edit');
          setIsModalOpen(true);
        }}
        setActividadSeleccionada={(actividad) => {
          setActividadSeleccionada(actividad);
          setModalType('delete');
          setIsDeleteModalOpen(true);
        }}
        setModalType={setModalType}
      />
    </div>
  );
};

export default Actividad;
