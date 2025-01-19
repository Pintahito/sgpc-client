import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProveedorList from './ProveedorList';
import ProveedorForm from './ProveedorForm'; // Componente para editar y agregar proveedores
import Modal from './Modal'; // Modal para eliminar proveedores
import Swal from 'sweetalert2';

const apiUrl = process.env.REACT_APP_API_URL;
console.log(apiUrl);


const Proveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [proveedorEditado, setProveedorEditado] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Controlar apertura de modal de formulario
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Controlar apertura de modal de eliminar
  const [modalType, setModalType] = useState(null); // Nueva función para gestionar el tipo de modal
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null); // Proveedor seleccionado para eliminar o editar
  const [newProveedor, setNewProveedor] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    rfc: '',
    created_at: '',
  });

  // Obtener todos los proveedores
  const fetchProveedores = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/suppliers`);
      setProveedores(response.data);
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
      if (error.response?.status === 403) {
        Swal.fire('Acceso denegado', 'Token inválido o no autorizado', 'error');
      }
    }
  };

  useEffect(() => {
    fetchProveedores();
  }, []);

  // Crear o actualizar un proveedor
  const saveProveedor = async (values) => {
    try {
      if (proveedorEditado) {
        await axios.put(`${apiUrl}/api/v1/suppliers/${proveedorEditado.id_supplier}`, values);
        Swal.fire({
          title: "¡Proveedor editado con éxito!",
          icon: "success",
          draggable: true
        });
      } else {
        await axios.post(`${apiUrl}/api/v1/suppliers`, values);
        Swal.fire({
          title: "¡Proveedor agregado con éxito!",
          icon: "success",
          draggable: true
        });
      }
      fetchProveedores();
      closeModal();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Verifica tus datos!',
      });
      console.error('Error al guardar proveedor:', error);
    }
  };

  // Eliminar un proveedor
  const deleteProveedor = async () => {
    try {
      await axios.delete(`${apiUrl}/api/v1/suppliers/${proveedorSeleccionado.id_supplier}`);
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
      fetchProveedores();
      closeDeleteModal();
    } catch (error) {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "!Hay otra tabla dependiendo de esta!",
            });
      console.error('Error al eliminar proveedor:', error);
    }
  };

  // Cerrar modal y resetear formulario
  const closeModal = () => {
    setIsModalOpen(false);
    setProveedorEditado(null);
    setNewProveedor({ name: '', address: '', phone: '', email: '', rfc: '', created_at: '' });
  };

  // Cerrar modal de eliminación
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setProveedorSeleccionado(null);
  };

  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    setNewProveedor({ ...newProveedor, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-500 text-gray-800 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">Gestión de Proveedores</h1>

      <button
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
        onClick={() => {
          setModalType('add');
          setIsModalOpen(true);
        }}
      >
        Agregar Proveedor
      </button>

      {isModalOpen && modalType === 'add' && (
        <Modal closeModal={closeModal}>
          <ProveedorForm
            proveedor={newProveedor}
            setProveedor={setNewProveedor}
            onSave={saveProveedor}
            proveedorEditado={proveedorEditado}
            handleInputChange={handleInputChange}
            closeModal={closeModal}
          />
        </Modal>
      )}

      {isModalOpen && modalType === 'edit' && (
        <Modal closeModal={closeModal}>
          <ProveedorForm
            proveedor={newProveedor}
            setProveedor={setNewProveedor}
            onSave={saveProveedor}
            proveedorEditado={proveedorEditado}
            handleInputChange={handleInputChange}
            closeModal={closeModal}
          />
        </Modal>
      )}

      {isDeleteModalOpen && modalType === 'delete' && (
        <Modal closeModal={closeDeleteModal}>
          <div className="text-center">
            <p className="mb-4">
              ¿Estás seguro de que deseas eliminar a {proveedorSeleccionado?.name}?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition"
                onClick={deleteProveedor}
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

      <h2 className="text-2xl font-semibold mt-6 mb-4">Lista de Proveedores</h2>
      <ProveedorList
        proveedores={proveedores}
        setProveedorEditado={(proveedor) => {
          setProveedorEditado(proveedor);
          setNewProveedor(proveedor);
          setModalType('edit');
          setIsModalOpen(true);
        }}
        setProveedorSeleccionado={(proveedor) => {
          setProveedorSeleccionado(proveedor);
          setModalType('delete');
          setIsDeleteModalOpen(true);
        }}
        setModalType={setModalType} // Pasar el setModalType a ClienteList
      />
    </div>
  );
};

export default Proveedores;
