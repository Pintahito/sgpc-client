import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ClienteList from './ClienteList';
import ClienteForm from './ClienteForm'; // Componente para editar y agregar clientes
import Modal from './Modal'; // Modal para eliminar clientes
import Swal from 'sweetalert2';

const apiUrl = process.env.REACT_APP_API_URL;
console.log(apiUrl);

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [clienteEditado, setClienteEditado] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Controlar apertura de modal de formulario
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Controlar apertura de modal de eliminar
  const [modalType, setModalType] = useState(null); // Nueva función para gestionar el tipo de modal
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null); // Cliente seleccionado para eliminar o editar
  const [newCliente, setNewCliente] = useState({
    name: '',
    address: '',
    municipality: '',
    state: '',
    phone: '',
    email: '',
    rfc: '',
    created_at: ''
  });

  // Obtener todos los clientes
  const fetchClientes = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/clients`);
      setClientes(response.data);
    } catch (error) {
      console.error('Error al obtener clientes:', error);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  // Crear o actualizar un cliente
  const saveCliente = async (values) => {
    try {
      if (clienteEditado) {
        await axios.put(`${apiUrl}/api/v1/clients/${clienteEditado.idClient}`, values);
        Swal.fire({
          title: "¡Cliente agregado con éxito!",
          icon: "success",
          draggable: true
        });
      } else {
        await axios.post(`${apiUrl}/api/v1/clients`, values);
        Swal.fire({
          title: "¡Cliente agregado con éxito!",
          icon: "success",
          draggable: true
        });
      }
      fetchClientes();
      //revisar modal
      closeModal();
    } catch (error) {
      if (error.response) {
        const { data } = error.response;
        Swal.fire({
          icon: "error",
          title: "Error al agregar cliente",
          text: data.message || "No se pudo agregar al cliente",
          confirmButtonText: "Entendido",
        });
      }
    }
  };

  // Eliminar un cliente
  const deleteCliente = async () => {
    try {
      await axios.delete(`${apiUrl}/api/v1/clients/${clienteSeleccionado.idClient}`);
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
      fetchClientes();
      closeDeleteModal();
    } catch (error) {
      if (error.response) {
        const { data } = error.response;
        Swal.fire({
          icon: "error",
          title: "Error al eliminar cliente",
          text: data.message || "No se pudo agregar al cliente",
          confirmButtonText: "Entendido",
        });
      }
      console.error('Error al eliminar cliente:', error);
    }
  };

  // Cerrar modal y resetear formulario
  const closeModal = () => {
    setIsModalOpen(false);
    setClienteEditado(null);
    setNewCliente({ name: '', address: '', municipality: '', state: '', phone: '', email: '', rfc: '', created_at: '' });
  };

  // Cerrar modal de eliminación
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setClienteSeleccionado(null);
  };

  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    setNewCliente({ ...newCliente, [e.target.name]: e.target.value });
  };

  return (
    //color texto del modal
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-500 text-gray-800 dark:text-white">
      <h1 className="text-3xl font-bold  text-iosText dark:text-white mb-6">Gestión de Clientes</h1>

      <button
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
        onClick={() => {
          setModalType('add'); // Especificar el tipo de modal
          setIsModalOpen(true);
        }}>
        Agregar Cliente
      </button>

      {/* Modal para agregar o editar */}
      {isModalOpen && modalType === 'add' && (
        <Modal closeModal={closeModal}>
          <ClienteForm
            cliente={newCliente}
            setCliente={setNewCliente}
            onSave={saveCliente}
            clienteEditado={clienteEditado}
            handleInputChange={handleInputChange}
            closeModal={closeModal}
          />
        </Modal>
      )}

      {/* Modal para editar */}
      {isModalOpen && modalType === 'edit' && (
        <Modal closeModal={closeModal}>
          <ClienteForm
            cliente={newCliente}
            setCliente={setNewCliente}
            onSave={saveCliente}
            clienteEditado={clienteEditado}
            handleInputChange={handleInputChange}
            closeModal={closeModal}
          />
        </Modal>
      )}

      {/* Modal para confirmar eliminación */}
      {isDeleteModalOpen && modalType === 'delete' && (
        <Modal closeModal={closeDeleteModal}>
          <div className="text-center">
            <p className="mb-4">¿Estás seguro de que deseas eliminar a {clienteSeleccionado?.name}?</p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition"
                onClick={deleteCliente}>
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

      <ClienteList
        clientes={clientes}
        setClienteEditado={(cliente) => {
          setClienteEditado(cliente);
          setNewCliente(cliente);
          setModalType('edit'); // Especificar el tipo de modal para editar
          setIsModalOpen(true);
        }}
        setClienteSeleccionado={(cliente) => {
          setClienteSeleccionado(cliente);
          setModalType('delete'); // Especificar el tipo de modal para eliminar
          setIsDeleteModalOpen(true);
        }}
        setModalType={setModalType} // Pasar el setModalType a ClienteList
      />
    </div>
  );
};

export default Clientes;
