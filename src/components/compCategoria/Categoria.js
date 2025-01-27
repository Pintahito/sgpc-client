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
        Swal.fire({
          title: "¡Categoria editada con éxito!",
          icon: "success",
          draggable: true
        });
      } else {
        await axios.post(`${apiUrl}/api/v1/categories`, values);
        Swal.fire({
          title: "¡Categoria agregada con éxito!",
          icon: "success",
          draggable: true
        });
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
      fetchCategorias();
      closeDeleteModal();
    } catch (error) {
      if (error.response) {
        const { data } = error.response;
        Swal.fire({
          icon: "error",
          title: "Error al eliminar categoria",
          text: data.message || "No se pudo agregar al cliente",
          confirmButtonText: "Entendido",
        });
      }
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
      <h1 className="text-3xl font-bold  text-iosText dark:text-white mb-6">Gestión de Categorías</h1>

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
        setModalType={setModalType}
      />
    </div>
  );
};

export default Categoria;
