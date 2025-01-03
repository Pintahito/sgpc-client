import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ObraForm from './ObraForm';
import ObraList from './ObraList';
import Modal from './Modal'; // Modal para agregar, editar y eliminar
import Swal from 'sweetalert2';

const apiUrl = process.env.REACT_APP_API_URL;

const TipoObra = () => {
  // Estados de Obra
  const [obras, setObras] = useState([]);
  const [obraEditada, setObraEditada] = useState(null);
  const [obraSeleccionada, setObraSeleccionada] = useState(null);
  const [newObra, setNewObra] = useState({
    name: '',
    description: '',
    created_at:'',
    lastModifiedDate:''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');

  // Funciones para Obras
  const fetchObras = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/workTypes`);
      setObras(response.data);
    } catch (error) {
      console.error('Error al obtener las obras:', error);
    }
  };

  const saveObra = async (values) => {
    try {
      if (obraEditada) {
        await axios.put(`${apiUrl}/api/v1/workTypes/${obraEditada.idWorkType}`, values);
        Swal.fire("¡Obra editada con éxito!");
      } else {
        await axios.post(`${apiUrl}/api/v1/workTypes`, values);
        Swal.fire("¡Obra agregada con éxito!");
      }
      fetchObras();
      closeModal();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error al guardar la obra.",
      });
      console.error('Error al guardar obra:', error);
    }
  };

  const deleteObra = async () => {
    try {
      await axios.delete(`${apiUrl}/api/v1/workTypes/${obraSeleccionada.idWorkType}`);
      Swal.fire("¡Obra eliminada con éxito!");
      fetchObras();
      closeDeleteModal();
    } catch (error) {
      console.error('Error al eliminar obra:', error);
    }
  };

  // Cerrar modal de formulario
  const closeModal = () => {
    setIsModalOpen(false);
    setNewObra({
      name: '',
      description: ''
    });
  };

  // Cerrar modal de confirmación de eliminación
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setObraSeleccionada(null);
  };

  useEffect(() => {
    fetchObras();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-500 text-gray-800 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">Gestión de Tipos de Obras</h1>

      <button
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
        onClick={() => {
          setModalType('add');
          setIsModalOpen(true);
        }}>
        Agregar Obra
      </button>

      {/* Modal para agregar o editar obra */}
      {isModalOpen && (modalType === 'add' || modalType === 'edit') && (
        <Modal closeModal={closeModal}>
          <ObraForm
            obra={newObra}
            setObra={setNewObra}
            onSave={saveObra}
            obraEditada={obraEditada}
            handleInputChange={(e) => setNewObra({ ...newObra, [e.target.name]: e.target.value })}
            closeModal={closeModal}
          />
        </Modal>
      )}

      {/* Modal de confirmación de eliminación */}
      {isDeleteModalOpen && modalType === 'delete' && (
        <Modal closeModal={closeDeleteModal}>
          <div className="text-center">
            <p className="mb-4">¿Estás seguro de que deseas eliminar la obra {obraSeleccionada?.name}?</p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition"
                onClick={deleteObra}>
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

      <h2 className="text-2xl font-semibold mt-6 mb-4">Lista de Tipos de Obras</h2>
      <ObraList
        obras={obras}
        setObraEditada={(obra) => {
          setObraEditada(obra);
          setNewObra(obra);
          setModalType('edit');
          setIsModalOpen(true);
        }}
        setObraSeleccionada={(obra) => {
          setObraSeleccionada(obra);
          setModalType('delete');
          setIsDeleteModalOpen(true);
        }}
        setModalType={setModalType}
      />
    </div>
  );
};

export default TipoObra;
