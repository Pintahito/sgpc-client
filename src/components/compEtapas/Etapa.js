import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EtapaForm from './EtapaForm';
import EtapaList from './EtapaList';
import Modal from './Modal'; // Modal para agregar, editar y eliminar
import Swal from 'sweetalert2';

const apiUrl = process.env.REACT_APP_API_URL;
console.log(apiUrl);

const Etapa = () => {
  // Estados de Etapa
  const [etapas, setEtapas] = useState([]);
  const [etapaEditada, setEtapaEditada] = useState(null);
  const [etapaSeleccionada, setEtapaSeleccionada] = useState(null);
  const [newEtapa, setNewEtapa] = useState({
    name: '',
    description: '',
    createdDate: '',
    lastModifiedDate:''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');

  // Funciones para Etapas
  const fetchEtapas = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/stages`);
      setEtapas(response.data);
    } catch (error) {
      console.error('Error al obtener la etapa:', error);
    }
  };

  const saveEtapa = async (values) => {
    try {
      if (etapaEditada) {
        await axios.put(`${apiUrl}/api/v1/stages/${etapaEditada.idStage}`, values);
        Swal.fire({
          title: "¡Etapa editada con éxito!",
          icon: "success",
          draggable: true
        });
      } else {
        await axios.post(`${apiUrl}/api/v1/stages`, values);
        Swal.fire({
          title: "¡Etapa agregada con éxito!",
          icon: "success",
          draggable: true
        });
      }
      fetchEtapas();
      closeModal();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error al guardar la etapa.",
      });
      console.error('Error al guardar etapa:', error);
    }
  };

  const deleteEtapa = async () => {
    try {
      await axios.delete(`${apiUrl}/api/v1/stages/${etapaSeleccionada.idStage}`);
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
      fetchEtapas();
      closeDeleteModal();
    } catch (error) {
      if (error.response) {
        const { data } = error.response;
        Swal.fire({
          icon: "error",
          title: "Error al eliminar",
          text: data.message || "No se pudo agregar al cliente",
          confirmButtonText: "Entendido",
        });
      }
    }
  };

  // Cerrar modal de formulario
  const closeModal = () => {
    setIsModalOpen(false);
    setNewEtapa({
      name: '',
      description: ''
    });
  };

  // Cerrar modal de confirmación de eliminación
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setEtapaSeleccionada(null);
  };

  useEffect(() => {
    fetchEtapas();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-500 text-gray-800 dark:text-white">
      <h1 className="text-3xl font-bold text-iosText dark:text-white mb-6">Gestión de Etapas</h1>

      <button
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
        onClick={() => {
          setModalType('add');
          setIsModalOpen(true);
        }}>
        Agregar Etapa
      </button>

      {/* Modal para agregar o editar etapa */}
      {isModalOpen && (modalType === 'add' || modalType === 'edit') && (
        <Modal closeModal={closeModal}>
          <EtapaForm
            etapa={newEtapa}
            setEtapa={setNewEtapa}
            onSave={saveEtapa}
            etapaEditada={etapaEditada}
            handleInputChange={(e) => setNewEtapa({ ...newEtapa, [e.target.name]: e.target.value })}
            closeModal={closeModal}
          />
        </Modal>
      )}

      {/* Modal de confirmación de eliminación */}
      {isDeleteModalOpen && modalType === 'delete' && (
        <Modal closeModal={closeDeleteModal}>
          <div className="text-center">
            <p className="mb-4">¿Estás seguro de que deseas eliminar la etapa {etapaSeleccionada?.name}?</p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition"
                onClick={deleteEtapa}>
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

      
      <EtapaList
        etapas={etapas}
        setEtapaEditada={(etapa) => {
          setEtapaEditada(etapa);
          setNewEtapa(etapa);
          setModalType('edit');
          setIsModalOpen(true);
        }}
        setEtapaSeleccionada={(etapa) => {
          setEtapaSeleccionada(etapa);
          setModalType('delete');
          setIsDeleteModalOpen(true);
        }}
        setModalType={setModalType}
      />
    </div>
  );
};

export default Etapa;
