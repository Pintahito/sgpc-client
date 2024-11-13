import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BancoList from './BancoList';
import BancoForm from './BancoForm';
import Modal from './Modal';
import Swal from 'sweetalert2';

const apiUrl = process.env.REACT_APP_API_URL;
console.log(apiUrl);

const Banco = () => {
  const [bancos, setBancos] = useState([]);
  const [bancoEditado, setBancoEditado] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [bancoSeleccionado, setBancoSeleccionado] = useState(null);
  const [newBanco, setNewBanco] = useState({ name: '' });

  // Obtener todos los bancos
  const fetchBancos = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/banks`);
      setBancos(response.data);
    } catch (error) {
      console.error('Error al obtener los bancos:', error);
    }
  };

  useEffect(() => {
    fetchBancos();
  }, []);

  // Guardar banco (agregar o editar)
  const saveBanco = async (values) => {
    try {
      if (bancoEditado) {
        await axios.put(`${apiUrl}/api/v1/banks/${bancoEditado.id_bank}`, values);
        Swal.fire("¡Banco editado con éxito!");
      } else {
        await axios.post(`${apiUrl}/api/v1/banks`, values);
        Swal.fire("¡Banco agregado con éxito!");
      }
      fetchBancos();
      closeModal();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Verifica los datos del banco.",
      });
      console.error('Error al guardar banco:', error);
    }
  };

  // Eliminar banco
  const deleteBanco = async () => {
    try {
      await axios.delete(`${apiUrl}/api/v1/banks/${bancoSeleccionado.id_bank}`);
      Swal.fire("¡Banco eliminado con éxito!");
      fetchBancos();
      closeDeleteModal();
    } catch (error) {
      console.error('Error al eliminar banco:', error);
    }
  };

  // Cerrar modal de formulario
  const closeModal = () => {
    setIsModalOpen(false);
    setBancoEditado(null);
    setNewBanco({ name: '' });
  };

  // Cerrar modal de confirmación de eliminación
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setBancoSeleccionado(null);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-500 text-gray-800 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">Gestión de Bancos</h1>

      <button
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
        onClick={() => {
          setModalType('add');
          setIsModalOpen(true);
        }}>
        Agregar Banco
      </button>

      {/* Modal para agregar o editar banco */}
      {isModalOpen && (modalType === 'add' || modalType === 'edit') && (
        <Modal closeModal={closeModal}>
          <BancoForm
            banco={newBanco}
            setBanco={setNewBanco}
            onSave={saveBanco}
            bancoEditado={bancoEditado}
            handleInputChange={(e) => setNewBanco({ ...newBanco, [e.target.name]: e.target.value })}
            closeModal={closeModal}
          />
        </Modal>
      )}

      {/* Modal de confirmación de eliminación */}
      {isDeleteModalOpen && modalType === 'delete' && (
        <Modal closeModal={closeDeleteModal}>
          <div className="text-center">
            <p className="mb-4">¿Estás seguro de que deseas eliminar el banco {bancoSeleccionado?.nombre}?</p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition"
                onClick={deleteBanco}>
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

      <h2 className="text-2xl font-semibold mt-6 mb-4">Lista de Bancos</h2>
      <BancoList
        bancos={bancos}
        setBancoEditado={(banco) => {
          setBancoEditado(banco);
          setNewBanco(banco);
          setModalType('edit');
          setIsModalOpen(true);
        }}
        setBancoSeleccionado={(banco) => {
          setBancoSeleccionado(banco);
          setModalType('delete');
          setIsDeleteModalOpen(true);
        }}
        setModalType={setModalType} // Pasar el setModalType
      />
    </div>
  );
};

export default Banco;
