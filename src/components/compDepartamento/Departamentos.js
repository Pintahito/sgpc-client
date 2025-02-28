import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DepartamentoList from './DepartamentoList';
import DepartamentoForm from './DepartamentoForm'; // Componente para editar y agregar departamentos
import Modal from './Modal'; // Modal para eliminar departamentos
import Swal from 'sweetalert2';

const apiUrl = process.env.REACT_APP_API_URL;
console.log(apiUrl);

const Departamentos = () => {
  const [departamentos, setDepartamentos] = useState([]);
  const [departamentoEditado, setDepartamentoEditado] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Controlar apertura de modal de formulario
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Controlar apertura de modal de eliminar
  const [modalType, setModalType] = useState(null); // Tipo de modal
  const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState(null); // Departamento seleccionado para eliminar o editar
  const [newDepartamento, setNewDepartamento] = useState({
    name: '',
    description: '',
    email: ''
  });

  // Obtener todos los departamentos
  const fetchDepartamentos = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/departments`);
      setDepartamentos(response.data);
    } catch (error) {
      console.error('Error al obtener departamentos:', error);
    }
  };

  useEffect(() => {
    fetchDepartamentos();
  }, []);

  // Crear o actualizar un departamento
  const saveDepartamento = async (values) => {
    try {
      if (departamentoEditado) {
        await axios.put(`${apiUrl}/api/v1/departments/${departamentoEditado.idDepartment}`, values);
        Swal.fire({
          title: "¡Departamento editado con éxito!",
          icon: "success",
          draggable: true
        });
      } else {
        await axios.post(`${apiUrl}/api/v1/departments`, values);
        Swal.fire({
          title: "¡Departamento agregado con éxito!",
          icon: "success",
          draggable: true
        });
      }
      fetchDepartamentos();
      closeModal();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Verifica tus datos.",
      });
      console.error('Error al guardar departamento:', error);
    }
  };

  // Eliminar un departamento
  const deleteDepartamento = async () => {
    try {
      await axios.delete(`${apiUrl}/api/v1/departments/${departamentoSeleccionado.idDepartment}`);
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
      fetchDepartamentos();
      closeDeleteModal();
    } catch (error) {
      if (error.response) {
        const { data } = error.response;
        Swal.fire({
          icon: "error",
          title: "Error al eliminar departamento",
          text: data.message || "No se pudo agregar al cliente",
          confirmButtonText: "Entendido",
        });
      }
      console.error('Error al eliminar departamento:', error);
    }
  };

  // Cerrar modal y resetear formulario
  const closeModal = () => {
    setIsModalOpen(false);
    setDepartamentoEditado(null);
    setNewDepartamento({ name: '', description: '', email: '' });
  };

  // Cerrar modal de eliminación
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDepartamentoSeleccionado(null);
  };

  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    setNewDepartamento({ ...newDepartamento, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-500 text-gray-800 dark:text-white">
      <h1 className="text-3xl font-bold  text-iosText dark:text-white mb-6">Gestión de Departamentos</h1>

      <button
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
        onClick={() => {
          setModalType('add');
          setIsModalOpen(true);
        }}>
        Agregar Departamento
      </button>

      {/* Modal para agregar o editar */}
      {isModalOpen && modalType === 'add' && (
        <Modal closeModal={closeModal}>
          <DepartamentoForm
            departamento={newDepartamento}
            setDepartamento={setNewDepartamento}
            onSave={saveDepartamento}
            departamentoEditado={departamentoEditado}
            handleInputChange={handleInputChange}
            closeModal={closeModal}
          />
        </Modal>
      )}

      {/* Modal para editar */}
      {isModalOpen && modalType === 'edit' && (
        <Modal closeModal={closeModal}>
          <DepartamentoForm
            departamento={newDepartamento}
            setDepartamento={setNewDepartamento}
            onSave={saveDepartamento}
            departamentoEditado={departamentoEditado}
            handleInputChange={handleInputChange}
            closeModal={closeModal}
          />
        </Modal>
      )}

      {/* Modal para confirmar eliminación */}
      {isDeleteModalOpen && modalType === 'delete' && (
        <Modal closeModal={closeDeleteModal}>
          <div className="text-center">
            <p className="mb-4">¿Estás seguro de que deseas eliminar el departamento {departamentoSeleccionado?.name}?</p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition"
                onClick={deleteDepartamento}>
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

      
      <DepartamentoList
        departamentos={departamentos}
        setDepartamentoEditado={(departamento) => {
          setDepartamentoEditado(departamento);
          setNewDepartamento(departamento);
          setModalType('edit');
          setIsModalOpen(true);
        }}
        setDepartamentoSeleccionado={(departamento) => {
          setDepartamentoSeleccionado(departamento);
          setModalType('delete');
          setIsDeleteModalOpen(true);
        }}
        setModalType={setModalType}
      />
    </div>
  );
};

export default Departamentos;
