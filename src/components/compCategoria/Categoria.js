import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CategoriaForm from './CategoriaForm';
import CategoriaList from './CategoriaList';
import Modal from './Modal'; // Modal para agregar, editar y eliminar
import Swal from 'sweetalert2';

const apiUrl = process.env.REACT_APP_API_URL;
console.log(apiUrl);

const Categoria = () => {
  // Estados de Categoria
  const [categorias, setCategorias] = useState([]);
  const [categoriaEditada, setCategoriaEditada] = useState(null);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [newCategoria, setNewCategoria] = useState({
    name: '',
    description: ''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');

  // Funciones para Categorias
  const fetchCategorias = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/categories`);
      setCategorias(response.data);
    } catch (error) {
      console.error('Error al obtener la categoria:', error);
    }
  };

  const saveCategoria = async (values) => {
    try {
      if (categoriaEditada) {
        await axios.put(`${apiUrl}/api/v1/categories/${categoriaEditada.idCategory}`, values);
        Swal.fire("¡Categoria editada con éxito!");
      } else {
        await axios.post(`${apiUrl}/api/v1/categories`, values);
        Swal.fire("¡Categoria agregada con éxito!");
      }
      fetchCategorias();
      closeModal();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error al guardar la categoria.",
      });
      console.error('Error al guardar categoria:', error);
    }
  };

  const deleteCategoria = async () => {
    try {
      await axios.delete(`${apiUrl}/api/v1/categories/${categoriaSeleccionada.idCategory}`);
      Swal.fire("¡Categoria eliminada con éxito!");
      fetchCategorias();
      closeDeleteModal();
    } catch (error) {
      console.error('Error al eliminar categoria:', error);
    }
  };

  // Cerrar modal de formulario
  const closeModal = () => {
    setIsModalOpen(false);
    setNewCategoria({
      name: '',
      description: ''
    });
  };

  // Cerrar modal de confirmación de eliminación
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCategoriaSeleccionada(null);
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-500 text-gray-800 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">Gestión de Categorías</h1>

      <button
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
        onClick={() => {
          setModalType('add');
          setIsModalOpen(true);
        }}>
        Agregar Categoría
      </button>

      {/* Modal para agregar o editar categoría */}
      {isModalOpen && (modalType === 'add' || modalType === 'edit') && (
        <Modal closeModal={closeModal}>
          <CategoriaForm
            categoria={newCategoria}
            setCategoria={setNewCategoria}
            onSave={saveCategoria}
            categoriaEditada={categoriaEditada}
            handleInputChange={(e) => setNewCategoria({ ...newCategoria, [e.target.name]: e.target.value })}
            closeModal={closeModal}
          />
        </Modal>
      )}

      {/* Modal de confirmación de eliminación */}
      {isDeleteModalOpen && modalType === 'delete' && (
        <Modal closeModal={closeDeleteModal}>
          <div className="text-center">
            <p className="mb-4">¿Estás seguro de que deseas eliminar la categoría {categoriaSeleccionada?.name}?</p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition"
                onClick={deleteCategoria}>
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

      <h2 className="text-2xl font-semibold mt-6 mb-4">Lista de Categorías</h2>
      <CategoriaList
        categorias={categorias}
        setCategoriaEditada={(categoria) => {
          setCategoriaEditada(categoria);
          setNewCategoria(categoria);
          setModalType('edit');
          setIsModalOpen(true);
        }}
        setCategoriaSeleccionada={(categoria) => {
          setCategoriaSeleccionada(categoria);
          setModalType('delete');
          setIsDeleteModalOpen(true);
        }}
      />
    </div>
  );
};

export default Categoria;
