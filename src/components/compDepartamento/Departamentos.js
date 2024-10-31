import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DepartamentoList from './DepartamentoList';
import DepartamentoForm from './DepartamentoForm'; // Componente para editar y agregar departamentos
import Modal from './Modal'; // Modal para eliminar departamentos
import Swal from 'sweetalert2';

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
      const response = await axios.get('http://10.73.1.35:8081/api/v1/departments');
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
        await axios.put(`http://10.73.1.35:8081/api/v1/departments/${departamentoEditado.id_departament}`, values);
        Swal.fire("¡Departamento editado con éxito!");
      } else {
        await axios.post('http://10.73.1.35:8081/api/v1/departments', values);
        Swal.fire("¡Departamento agregado con éxito!");
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
      await axios.delete(`http://10.73.1.35:8081/api/v1/departments/${departamentoSeleccionado.id_departament}`);
      Swal.fire("¡Departamento eliminado con éxito!");
      fetchDepartamentos();
      closeDeleteModal();
    } catch (error) {
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
      <h1 className="text-3xl font-bold mb-6">Gestión de Departamentos</h1>

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

      <h2 className="text-2xl font-semibold mt-6 mb-4">Lista de Departamentos</h2>
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
