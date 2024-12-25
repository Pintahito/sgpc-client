
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import CategoriaForm from './CategoriaForm';
import CategoriaList from './CategoriaList';

import EmpleadoForm from './EmpleadoForm';
import EmpleadoList from './EmpleadoList';

import Modal from './Modal';
import Swal from 'sweetalert2';

const apiUrl = process.env.REACT_APP_API_URL;
console.log(apiUrl);

const Empleados = () => {
  const [activeTab, setActiveTab] = useState("empleado");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);

  // Estados de empleados
  const [empleados, setEmpleados] = useState([]);
  const [empleadoEditado, setEmpleadoEditado] = useState(null);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
  const [newEmpleado, setNewEmpleado] = useState({
    name: '',
    rfc: '',
    email: '',
    hiringDate: '',
    employeeType: '',
    positionId: '',
    categoryId: '',
    accounts: [{bankId:'', accountNumber: ''}],
    phones: [{phone: '',employeeId: ''}],
    //empleado de obra
    startDate: '',
    endDate:''
  });

  // Funciones para Empleado
  const fetchEmpleados = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/employees`);
      setEmpleados(response.data);
    } catch (error) {
      console.error('Error al obtener el empleado:', error);
    }
  };

  const saveEmpleado = async (values) => {
    try {
      if (empleadoEditado) {
        await axios.put(`${apiUrl}/api/v1/employees/${empleadoEditado.id_employess}`, values);
        Swal.fire("¡Empleado editado con éxito!");
      } else {
        await axios.post(`${apiUrl}/api/v1/employees`, values);
        Swal.fire("¡Empleado agregado con éxito!");
      }
      fetchEmpleados();
      closeModal();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error al guardar el empleado.",
      });
      console.error('Error al guardar empleado:', error);
    }
  };

  const deleteEmpleado = async () => {
    try {
      await axios.delete(`${apiUrl}/api/v1/employees/${empleadoSeleccionado.id}`);
      Swal.fire("¡Empleado eliminado con éxito!");
      fetchEmpleados();
      closeDeleteModal();
    } catch (error) {
      console.error('Error al eliminar empleado:', error);
    }
  };

  //Funciones Para Categoria
  // Estados de Categoria
  const [categorias, setCategorias] = useState([]);
  const [categoriaEditada, setCategoriaEditada] = useState(null);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [newCategoria, setNewCategoria] = useState({
    name: '',
    description: ''
  });
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
        await axios.put(`${apiUrl}/api/v1/categories/${categoriaEditada.id_category}`, values);
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
      await axios.delete(`${apiUrl}/api/v1/categories/${categoriaSeleccionada.id_category}`);
      Swal.fire("¡Categoria eliminada con éxito!");
      fetchCategorias();
      closeDeleteModal();
    } catch (error) {
      console.error('Error al eliminarcategoria:', error);
    }
  };

  // Manejo de modales
  const closeModal = () => {
    setIsModalOpen(false);
    setEmpleadoEditado(null);
    setCategoriaEditada(null);
    setNewEmpleado({
      name: '',
      rfc: '',
      email: '',
      hiringDate: '',
      employeeType: '',
      positionId: '',
      categoryId: '',
      accounts: [{bankId:'', accountNumber: ''}],
      phones: [{phone: '',employeeId: 0}],
      //empleado de obra
      startDate: '',
      endDate:''
    });
    setNewCategoria({
      name: '',
      description: ''
    });
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setEmpleadoSeleccionado(null);
    setCategoriaSeleccionada(null);
  };

  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    setNewCategoria({ ...newCategoria, [e.target.name]: e.target.value });
    setNewEmpleado({ ...newEmpleado, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    fetchEmpleados();
    fetchCategorias();
  }, []);

  // Renderizado de contenido según la pestaña activa
  const renderContent = () => {
    switch (activeTab) {
      case "empleado":
        return (
          <div>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition mb-4"
              onClick={() => {
                setModalType('add');
                setIsModalOpen(true);
              }}>
              Agregar Empleado
            </button>
            <EmpleadoList
              empleados={empleados}
              setEmpleadoEditado={(empleado) => {
                setEmpleadoEditado(empleado);
                setNewEmpleado(empleado);
                setModalType('edit');
                setIsModalOpen(true);
              }}
              setEmpleadoSeleccionado={(empleado) => {
                setEmpleadoSeleccionado(empleado);
                setModalType('delete');
                setIsDeleteModalOpen(true);
              }}
              setModalType={setModalType} // Pasar el setModalType
            />
          </div>
        );
      case "categoria":
        return (
          <div>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition mb-4"
              onClick={() => {
                setModalType('add');
                setIsModalOpen(true);
              }}>
              Agregar Categoria
            </button>
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
              setModalType={setModalType} // Pasar el setModalType
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-500 text-gray-800 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">Gestión de Empleados</h1>

      <div className="flex justify-center space-x-3 mb-6">
        <button
          className={`py-2 px-4 rounded-md transform transition-all duration-200 ${activeTab === 'maquinaria' ? 'bg-blue-500 text-white scale-105' : 'bg-gray-300 text-gray-800'} hover:scale-110`}
          onClick={() => setActiveTab("empleado")}>
          Empleados
        </button>
        <button
          className={`py-2 px-4 rounded-md transform transition-all duration-200 ${activeTab === 'vehiculos' ? 'bg-blue-500 text-white scale-105' : 'bg-gray-300 text-gray-800'} hover:scale-110`}
          onClick={() => setActiveTab("categoria")}>
          Categoria
        </button>
      </div>

      {renderContent()}

      {isModalOpen && (modalType === 'add' || modalType === 'edit') && (
        <Modal isOpen={isModalOpen} closeModal={closeModal}>
          {activeTab === 'empleado' ? (
            <EmpleadoForm
              empleado={newEmpleado}
              setEmpleados={setNewEmpleado}
              onSave={saveEmpleado}
              empleadoEditado={empleadoEditado}
              handleInputChange={handleInputChange}
              closeModal={closeModal}
            />
          ) : (
            <CategoriaForm
              categoria={newCategoria}
              setCategoria={setNewCategoria}
              onSave={saveCategoria}
              categoriaEditada={categoriaEditada}
              handleInputChange={handleInputChange}
              //initialValues={newCategoria}
              closeModal={closeModal}
            />
          )}
        </Modal>
      )}

      {isDeleteModalOpen && (
        <Modal isOpen={isDeleteModalOpen} closeModal={closeDeleteModal}>
          <p>¿Estás seguro de que deseas eliminar?</p>
          <div className="flex justify-end mt-4">
            <button
              className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 mr-2"
              onClick={activeTab === 'empleado' ? deleteEmpleado : deleteCategoria}>
              Eliminar
            </button>
            <button
              className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400"
              onClick={closeDeleteModal}>
              Cancelar
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Empleados;
