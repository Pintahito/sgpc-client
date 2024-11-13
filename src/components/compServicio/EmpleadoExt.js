import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EmpleadoList from './EmpleadoExtList'; // Lista de empleados
import EmpleadoForm from './EmpleadoExtForm'; // Formulario de agregar/editar empleados
import Modal from './Modal'; // Modal para agregar, editar y eliminar
import Swal from 'sweetalert2';

const apiUrl = process.env.REACT_APP_API_URL;
console.log(apiUrl);

const EmpleadoExt = () => {
  const [empleados, setEmpleados] = useState([]);
  const [empleadoEditado, setEmpleadoEditado] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Control del modal de formulario
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Control del modal de eliminar
  const [modalType, setModalType] = useState(null); // Tipo de modal (agregar, editar, eliminar)
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null); // Empleado seleccionado para eliminar o editar
  const [newEmpleado, setNewEmpleado] = useState({
    name: '',
    RFC: '',
    email: '',
    registrationDate: '',
  });

  // Obtener todos los empleados
  const fetchEmpleados = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/employees`);
      setEmpleados(response.data);
    } catch (error) {
      console.error('Error al obtener los empleados:', error);
    }
  };

  useEffect(() => {
    fetchEmpleados();
  }, []);

  // Guardar empleado (agregar o editar)
  const saveEmpleado = async (values) => {
    try {
      if (empleadoEditado) {
        await axios.put(`${apiUrl}/api/v1/services/${empleadoEditado.id_}`, values);
        Swal.fire("¡Empleado editado con éxito!");
      } else {
        await axios.post(`${apiUrl}/api/v1/services`, values);
        Swal.fire("¡Empleado agregado con éxito!");
      }
      fetchEmpleados();
      closeModal();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Verifica los datos del empleado.",
      });
      console.error('Error al guardar empleado:', error);
    }
  };

  // Eliminar empleado
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

  // Cerrar modal de formulario
  const closeModal = () => {
    setIsModalOpen(false);
    setEmpleadoEditado(null);
    setNewEmpleado({
      name: '',
      RFC: '',
      email: '',
      registrationDate: '',
    });
  };

  // Cerrar modal de confirmación de eliminación
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setEmpleadoSeleccionado(null);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-500 text-gray-800 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">Gestión de Empleados Externos</h1>

      <button
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
        onClick={() => {
          setModalType('add');
          setIsModalOpen(true);
        }}>
        Agregar Empleado
      </button>

      {/* Modal para agregar o editar empleado */}
      {isModalOpen && (modalType === 'add' || modalType === 'edit') && (
        <Modal closeModal={closeModal}>
          <EmpleadoForm
            empleado={newEmpleado}
            setEmpleado={setNewEmpleado}
            onSave={saveEmpleado}
            empleadoEditado={empleadoEditado}
            handleInputChange={(e) => setNewEmpleado({ ...newEmpleado, [e.target.name]: e.target.value })}
            closeModal={closeModal}
          />
        </Modal>
      )}

      {/* Modal de confirmación de eliminación */}
      {isDeleteModalOpen && modalType === 'delete' && (
        <Modal closeModal={closeDeleteModal}>
          <div className="text-center">
            <p className="mb-4">¿Estás seguro de que deseas eliminar al empleado {empleadoSeleccionado?.name}?</p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition"
                onClick={deleteEmpleado}>
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

      <h2 className="text-2xl font-semibold mt-6 mb-4">Lista de Empleados</h2>
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
      />
    </div>
  );
};

export default EmpleadoExt;
