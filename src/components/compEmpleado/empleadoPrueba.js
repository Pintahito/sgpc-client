import React, { useState, useEffect } from 'react';
import axios from 'axios';

import EmpleadoForm from './EmpleadoPlantaForm';
import EmpleadoList from './EmpleadoPlantaList';

import Modal from './Modal';
import Swal from 'sweetalert2';

const apiUrl = process.env.REACT_APP_API_URL;
console.log(apiUrl);

const Empleados = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);

  // Estados de empleados de planta
  const [empleadosP, setEmpleadosP] = useState([]);
  const [empleadoEditadoP, setEmpleadoEditadoP] = useState(null);
  const [empleadoSeleccionadoP, setEmpleadoSeleccionadoP] = useState(null);
  const [newEmpleadoP, setNewEmpleadoP] = useState({
    name: '',
    rfc: '',
    email: '',
    hiringDate: '',
    employeeType:'PLANTA',
    positionId: '',
    accounts: [{ bankId: '', accountNumber: '' }],
    phones: [{ phone: '', employeeId: '' }],
    //empleado de planta
    departmentId: '',
    workingHours: '',
    salary: '',
  });

  // Funciones para Empleado
  const fetchEmpleados = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/employees`);
      setEmpleadosP(response.data);
    } catch (error) {
      console.error('Error al obtener el empleado:', error);
    }
  };

  const saveEmpleado = async (values) => {
    try {
      if (empleadoEditadoP) {
        await axios.put(`${apiUrl}/api/v1/employees/${empleadoEditadoP.idEmployee}`, values);
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
      await axios.delete(`${apiUrl}/api/v1/employees/${empleadoSeleccionadoP.idEmployee}`);
      Swal.fire("¡Empleado eliminado con éxito!");
      fetchEmpleados();
      closeDeleteModal();
    } catch (error) {
      console.error('Error al eliminar empleado:', error);
    }
  };

  // Manejo de modales
  const closeModal = () => {
    setIsModalOpen(false);
    setEmpleadoEditadoP(null);
    setNewEmpleadoP({
      name: '',
      rfc: '',
      email: '',
      hiringDate: '',
      employeeType: 'PLANTA',
      positionId: '',
      accounts: [{ bankId: '', accountNumber: '' }],
      phones: [{ phone: '', employeeId: '' }],
      //empleado de planta
      departmentId: '',
      workingHours: '',
      salary: '',
    });
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setEmpleadoSeleccionadoP(null);
  };

  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    setNewEmpleadoP({ ...newEmpleadoP, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    fetchEmpleados();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-500 text-gray-800 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">Gestión de Empleados</h1>

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
          empleados={empleadosP}
          setEmpleadoEditado={(empleado) => {
            setEmpleadoEditadoP(empleado);
            setNewEmpleadoP(empleado);
            setModalType('edit');
            setIsModalOpen(true);
          }}
          setEmpleadoSeleccionado={(empleado) => {
            setEmpleadoSeleccionadoP(empleado);
            setModalType('delete');
            setIsDeleteModalOpen(true);
          }}
          setModalType={setModalType}
        />
      </div>

      {isModalOpen && (modalType === 'add' || modalType === 'edit') && (
        <Modal isOpen={isModalOpen} closeModal={closeModal}>
          <EmpleadoForm
            empleado={newEmpleadoP}
            setEmpleados={setNewEmpleadoP}
            onSave={saveEmpleado}
            empleadoEditado={empleadoEditadoP}
            handleInputChange={handleInputChange}
            closeModal={closeModal}
          />
        </Modal>
      )}

      {isDeleteModalOpen && (
        <Modal isOpen={isDeleteModalOpen} closeModal={closeDeleteModal}>
          <p>¿Estás seguro de que deseas eliminar?</p>
          <div className="flex justify-end mt-4">
            <button
              className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 mr-2"
              onClick={deleteEmpleado}>
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
