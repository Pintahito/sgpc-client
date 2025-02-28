import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PuestoList from './PuestoList'; // Lista de puestos
import PuestoForm from './PuestoForm'; // Formulario de agregar/editar puestos
import Modal from './Modal'; // Modal para agregar, editar y eliminar
import Swal from 'sweetalert2';

const apiUrl = process.env.REACT_APP_API_URL;
console.log(apiUrl);

const PuestoEmp = () => {
  const [puestos, setPuestos] = useState([]);
  const [puestoEditado, setPuestoEditado] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Control del modal de formulario
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Control del modal de eliminar
  const [modalType, setModalType] = useState(null); // Tipo de modal (agregar, editar, eliminar)
  const [puestoSeleccionado, setPuestoSeleccionado] = useState(null); // Puesto seleccionado para eliminar o editar
  const [newPuesto, setNewPuesto] = useState({
    name: '',
    description: '',
    statusType: '',
  });

  // Obtener todos los puestos
  const fetchPuestos = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/positions`);
      setPuestos(response.data);
    } catch (error) {
      console.error('Error al obtener los puestos:', error);
    }
  };

  useEffect(() => {
    fetchPuestos();
  }, []);

  // Guardar puesto (agregar o editar)
  const savePuesto = async (values) => {
    try {
      if (puestoEditado) {
        await axios.put(`${apiUrl}/api/v1/positions/${puestoEditado.idPosition}`, values);
        Swal.fire({
          title: "¡Puesto editado con éxito!",
          icon: "success",
          draggable: true
        });
      } else {
        await axios.post(`${apiUrl}/api/v1/positions`, values);
        Swal.fire({
          title: "¡Puesto agregado con éxito!",
          icon: "success",
          draggable: true
        });
      }
      fetchPuestos();
      closeModal();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Verifica los datos del puesto.",
      });
      console.error('Error al guardar puesto:', error);
    }
  };

  // Eliminar puesto
  const deletePuesto = async () => {
    try {
      await axios.delete(`${apiUrl}/api/v1/positions/${puestoSeleccionado.idPosition}`);
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
      
      fetchPuestos();
      closeDeleteModal();
    } catch (error) {
      if (error.response) {
        const { data } = error.response;
        Swal.fire({
          icon: "error",
          title: "Error al eliminar puesto",
          text: data.message || "No se pudo agregar al cliente",
          confirmButtonText: "Entendido",
        });
      }
      console.error('Error al eliminar puesto:', error);
    }
  };

  // Cerrar modal de formulario
  const closeModal = () => {
    setIsModalOpen(false);
    setPuestoEditado(null);
    setNewPuesto({
      name: '',
      description: '',
      statusType: '',
    });
  };

  // Cerrar modal de confirmación de eliminación
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setPuestoSeleccionado(null);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-500 text-gray-800 dark:text-white">
      <h1 className="text-3xl font-bold  text-iosText dark:text-white mb-6">Gestión de Puestos</h1>

      <button
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
        onClick={() => {
          setModalType('add');
          setIsModalOpen(true);
        }}>
        Agregar Puesto
      </button>

      {/* Modal para agregar o editar puesto */}
      {isModalOpen && (modalType === 'add' || modalType === 'edit') && (
        <Modal closeModal={closeModal}>
          <PuestoForm
            puesto={newPuesto}
            setPuesto={setNewPuesto}
            onSave={savePuesto}
            puestoEditado={puestoEditado}
            handleInputChange={(e) => setNewPuesto({ ...newPuesto, [e.target.name]: e.target.value })}
            closeModal={closeModal}
          />
        </Modal>
      )}

      {/* Modal de confirmación de eliminación */}
      {isDeleteModalOpen && modalType === 'delete' && (
        <Modal closeModal={closeDeleteModal}>
          <div className="text-center">
            <p className="mb-4">¿Estás seguro de que deseas eliminar el puesto {puestoSeleccionado?.name}?</p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition"
                onClick={deletePuesto}>
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

      
      <PuestoList
        puestos={puestos}
        setPuestoEditado={(puesto) => {
          setPuestoEditado(puesto);
          setNewPuesto(puesto);
          setModalType('edit');
          setIsModalOpen(true);
        }}
        setPuestoSeleccionado={(puesto) => {
          setPuestoSeleccionado(puesto);
          setModalType('delete');
          setIsDeleteModalOpen(true);
        }}
        setModalType={setModalType} // Pasar el setModalType a PuestoList
      />
    </div>
  );
};

export default PuestoEmp;
