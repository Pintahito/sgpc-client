import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PuestoList from './PuestoList'; // Lista de puestos
import PuestoForm from './PuestoForm'; // Formulario de agregar/editar puestos
import Modal from '../compEmpleado/Modal'; // Modal para agregar, editar y eliminar
import Swal from 'sweetalert2';

const PuestoEmp = () => {
  const [puestos, setPuestos] = useState([]);
  const [puestoEditado, setPuestoEditado] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Control del modal de formulario
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Control del modal de eliminar
  const [modalType, setModalType] = useState(null); // Tipo de modal (agregar, editar, eliminar)
  const [puestoSeleccionado, setPuestoSeleccionado] = useState(null); // Puesto seleccionado para eliminar o editar
  const [newPuesto, setNewPuesto] = useState({
    name: '',
    descripcion: '',
    statusType: '',
  });

  // Obtener todos los puestos
  const fetchPuestos = async () => {
    try {
      const response = await axios.get('http://10.73.1.34:8081/api/v1/puestos');
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
        await axios.put(`http://10.73.1.34:8081/api/v1/puestos/${puestoEditado.id}`, values);
        Swal.fire("¡Puesto editado con éxito!");
      } else {
        await axios.post('http://10.73.1.34:8081/api/v1/puestos', values);
        Swal.fire("¡Puesto agregado con éxito!");
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
      await axios.delete(`http://10.73.1.34:8081/api/v1/puestos/${puestoSeleccionado.id}`);
      Swal.fire("¡Puesto eliminado con éxito!");
      fetchPuestos();
      closeDeleteModal();
    } catch (error) {
      console.error('Error al eliminar puesto:', error);
    }
  };

  // Cerrar modal de formulario
  const closeModal = () => {
    setIsModalOpen(false);
    setPuestoEditado(null);
    setNewPuesto({
      name: '',
      descripcion: '',
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
      <h1 className="text-3xl font-bold mb-6">Gestión de Puestos</h1>

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

      <h2 className="text-2xl font-semibold mt-6 mb-4">Lista de Puestos</h2>
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
      />
    </div>
  );
};

export default PuestoEmp;
