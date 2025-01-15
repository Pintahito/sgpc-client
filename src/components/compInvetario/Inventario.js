import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InventarioList from './InventarioList';
import InventarioForm from './InventarioForm';
import Modal from './Modal';
import Swal from 'sweetalert2';

const apiUrl = process.env.REACT_APP_API_URL;
console.log(apiUrl);

const Inventario = () => {
  const [inventario, setInventario] = useState([]);
  const [articuloEditado, setArticuloEditado] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [articuloSeleccionado, setArticuloSeleccionado] = useState(null);
  const [newArticulo, setNewArticulo] = useState({
    name: '',
    amount: 0,
    description: '',
    price: 0,
    inputType: '',
    wineryName: '',
    supplierId: '',
    supplierNames: ''
  });

  const fetchInventario = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/inventories`);
      setInventario(response.data);
    } catch (error) {
      console.error('Error al obtener el inventario:', error);
    }
  };

  useEffect(() => {
    fetchInventario();
  }, []);

  const saveArticulo = async (values) => {
    try {
      if (articuloEditado) {
        await axios.put(`${apiUrl}/api/v1/inventories/${articuloEditado.id_inventory}`, values);
        Swal.fire("¡Artículo editado con éxito!");
      } else {
        await axios.post(`${apiUrl}/api/v1/inventories`, values);
        Swal.fire("¡Artículo agregado con éxito!");
      }
      fetchInventario();
      closeModal();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Verifica los datos del artículo.",
      });
      console.error('Error al guardar artículo:', error);
    }
  };

  const deleteArticulo = async () => {
    try {
      await axios.delete(`${apiUrl}/api/v1/inventory/${articuloSeleccionado.id_inventory}`);
      Swal.fire("¡Artículo eliminado con éxito!");
      fetchInventario();
      closeDeleteModal();
    } catch (error) {
      console.error('Error al eliminar artículo:', error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "!Hay otra tabla dependiendo de esta!",
      });
      console.log('Datos:', articuloSeleccionado);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setArticuloEditado(null);
    setNewArticulo({
      name: '',
      amount: 0,
      description: '',
      price: 0,
      inputType: '',
      wineryName: '',
      supplierId: '',
      supplierNames: ''
    });
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setArticuloSeleccionado(null);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-500 text-gray-800 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">Gestión de Inventario</h1>
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition mb-4"
        onClick={() => {
          setModalType('add');
          setIsModalOpen(true);
        }}>
        Agregar Artículo
      </button>
      {/* Modales */}
      {isModalOpen && (modalType === 'add' || modalType === 'edit') && (
        <Modal closeModal={closeModal}>
          <InventarioForm
            articulo={newArticulo}
            setArticulo={setNewArticulo}
            onSave={saveArticulo}
            articuloEditado={articuloEditado}
            handleInputChange={(e) => setNewArticulo({ ...newArticulo, [e.target.name]: e.target.value })}
            closeModal={closeModal}
          />
        </Modal>
      )}
      {isDeleteModalOpen && modalType === 'delete' && (
        <Modal closeModal={closeDeleteModal}>
          <div className="text-center">
            <p className="mb-4">¿Estás seguro de que deseas eliminar el artículo {articuloSeleccionado?.name}?</p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition"
                onClick={deleteArticulo}>
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
      <h2 className="text-2xl font-semibold mt-6 mb-4">Lista de Inventario</h2>
      <InventarioList
        inventario={inventario}
        setArticuloEditado={(articulo) => {
          setArticuloEditado(articulo);
          setNewArticulo(articulo);
          setModalType('edit');
          setIsModalOpen(true);
        }}
        setArticuloSeleccionado={(articulo) => {
          setArticuloSeleccionado(articulo);
          setModalType('delete');
          setIsDeleteModalOpen(true);
        }}
        setModalType={setModalType} // Pasar el setModalType
      />
    </div>
  );
};

export default Inventario;
