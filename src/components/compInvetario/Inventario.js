import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InventarioList from './InventarioList'; // Lista de artículos
import InventarioForm from './InventarioForm'; // Formulario de agregar/editar artículos
import Modal from './Modal'; // Modal para agregar, editar y eliminar
import Swal from 'sweetalert2';

const Inventario = () => {
  const [inventario, setInventario] = useState([]);
  const [articuloEditado, setArticuloEditado] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Control del modal de formulario
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Control del modal de eliminar
  const [modalType, setModalType] = useState(null); // Tipo de modal (agregar, editar, eliminar)
  const [articuloSeleccionado, setArticuloSeleccionado] = useState(null); // Artículo seleccionado para eliminar o editar
  const [newArticulo, setNewArticulo] = useState({
    name: '',
    description: '',
    quantity: 0,
    price: 0,
  });

  // Obtener todos los artículos del inventario
  const fetchInventario = async () => {
    try {
      const response = await axios.get('http://10.73.1.34:8081/api/v1/inventory');
      setInventario(response.data);
    } catch (error) {
      console.error('Error al obtener el inventario:', error);
    }
  };

  useEffect(() => {
    fetchInventario();
  }, []);

  // Guardar artículo (agregar o editar)
  const saveArticulo = async (values) => {
    try {
      if (articuloEditado) {
        await axios.put(`http://10.73.1.34:8081/api/v1/inventory/${articuloEditado.id}`, values);
        Swal.fire("¡Artículo editado con éxito!");
      } else {
        await axios.post('http://10.73.1.34:8081/api/v1/inventory', values);
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

  // Eliminar artículo
  const deleteArticulo = async () => {
    try {
      await axios.delete(`http://10.73.1.34:8081/api/v1/inventory/${articuloSeleccionado.id}`);
      Swal.fire("¡Artículo eliminado con éxito!");
      fetchInventario();
      closeDeleteModal();
    } catch (error) {
      console.error('Error al eliminar artículo:', error);
    }
  };

  // Cerrar modal de formulario
  const closeModal = () => {
    setIsModalOpen(false);
    setArticuloEditado(null);
    setNewArticulo({
      name: '',
      description: '',
      quantity: 0,
      price: 0,
    });
  };

  // Cerrar modal de confirmación de eliminación
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setArticuloSeleccionado(null);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-500 text-gray-800 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">Gestión de Inventario</h1>

      <button
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
        onClick={() => {
          setModalType('add');
          setIsModalOpen(true);
        }}>
        Agregar Artículo
      </button>

      {/* Modal para agregar o editar artículo */}
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

      {/* Modal de confirmación de eliminación */}
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

      <h2 className="text-2xl font-semibold mt-6 mb-4">Lista de Artículos</h2>
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
      />
    </div>
  );
};

export default Inventario;
