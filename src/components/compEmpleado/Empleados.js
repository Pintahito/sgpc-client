import React, { useState, useEffect } from 'react';
import axios from 'axios';

import EmpleadoPlantaForm from './EmpleadoPlantaForm';
import EmpleadoPlantaList from './EmpleadoPlantaList';
import EmpleadoObraForm from './EmpleadoObraForm';
import EmpleadoObraList from './EmpleadoObraList';

import Modal from './Modal';
import Swal from 'sweetalert2';

const apiUrl = process.env.REACT_APP_API_URL;
console.log(apiUrl);

const Empleados = () => {
  const [activeTab, setActiveTab] = useState("obra");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);

  // Estados de empleados
  const [empleadosO, setEmpleadosO] = useState([]);
  const [empleadoEditadoO, setEmpleadoEditadoO] = useState(null);
  const [empleadoSeleccionadoO, setEmpleadoSeleccionadoO] = useState(null);
  const [newEmpleadoO, setNewEmpleadoO] = useState({
    name: '',
    rfc: '',
    email: '',
    hiringDate: '',
    employeeType: 'OBRA',
    positionId: '',
    accounts: [{ bankId: '', accountNumber: '' }],
    phones: [{ phone: '', employeeId: '' }],
    //empleado de obra
    startDate: '',
    endDate: ''
  });

  // Funciones para Empleado
  const fetchEmpleadosO = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/employees`);
      setEmpleadosO(response.data);
    } catch (error) {
      console.error('Error al obtener el empleado:', error);
    }
  };

  const saveObra = async (values) => {
    try {
      if (empleadoEditadoO) {
        await axios.put(`${apiUrl}/api/v1/employees/${empleadoEditadoO.idEmployee}`, values);
        Swal.fire("¡Empleado editado con éxito!");
      } else {
        await axios.post(`${apiUrl}/api/v1/employees`, values);
        Swal.fire("¡Empleado agregado con éxito!");
      }
      fetchEmpleadosO();
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

  const deleteObra = async () => {
    try {
      await axios.delete(`${apiUrl}/api/v1/employees/${empleadoSeleccionadoO.idEmployee}`);
      Swal.fire("¡Empleado eliminado con éxito!");
      fetchEmpleadosO();
      closeDeleteModal();
    } catch (error) {
      console.error('Error al eliminar empleado:', error);
    }
  };

  // Estados de empleados de planta
  const [empleadosP, setEmpleadosP] = useState([]);
  const [empleadoEditadoP, setEmpleadoEditadoP] = useState(null);
  const [empleadoSeleccionadoP, setEmpleadoSeleccionadoP] = useState(null);
  const [newEmpleadoP, setNewEmpleadoP] = useState({
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

  // Funciones para Empleado de planta
  const fetchEmpleadosP = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/employees`);
      setEmpleadosP(response.data);
    } catch (error) {
      console.error('Error al obtener el empleado:', error);
    }
  };

  const savePlanta = async (values) => {
    try {
      if (empleadoEditadoP) {
        await axios.put(`${apiUrl}/api/v1/employees/${empleadoEditadoP.idEmployee}`, values);
        Swal.fire("¡Empleado editado con éxito!");
      } else {
        await axios.post(`${apiUrl}/api/v1/employees`, values);
        Swal.fire("¡Empleado agregado con éxito!");
      }
      fetchEmpleadosP();
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

  const deletePlanta = async () => {
    try {
      await axios.delete(`${apiUrl}/api/v1/employees/${empleadoSeleccionadoP.idEmployee}`);
      Swal.fire("¡Empleado eliminado con éxito!");
      fetchEmpleadosP();
      closeDeleteModal();
    } catch (error) {
      console.error('Error al eliminar empleado:', error);
    }
  };

  // Manejo de modales
  const closeModal = () => {
    setIsModalOpen(false);
    setEmpleadoEditadoO(null);
    setNewEmpleadoO({
      name: '',
      rfc: '',
      email: '',
      hiringDate: '',
      employeeType: 'OBRA',
      positionId: '',
      accounts: [{ bankId: '', accountNumber: '' }],
      phones: [{ phone: '', employeeId: '' }],
      //empleado de obra
      startDate: '',
      endDate: ''
    });
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
    setEmpleadoSeleccionadoO(null);
    setEmpleadoEditadoO(null);
    setEmpleadoSeleccionadoP(null);
    setEmpleadoEditadoP(null);
  };

  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    setNewEmpleadoO({ ...newEmpleadoO, [e.target.name]: e.target.value });
    setNewEmpleadoP({ ...newEmpleadoP, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    fetchEmpleadosO();
    fetchEmpleadosP();
  }, []);

  // Renderizado de contenido según la pestaña activa
  const renderContent = () => {
    switch (activeTab) {
      case "obra":
        return (
          <div>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition mb-4"
              onClick={() => {
                setModalType('add');
                setIsModalOpen(true);
              }}>
              Agregar Empleado Obra
            </button>
            <h2 className="text-2xl font-semibold mt-6 mb-4">Lista Empleados Obra</h2>
            <EmpleadoObraList
              empleadosO={empleadosO}
              setEmpleadoEditadoO={(empleadoObra) => {
                setEmpleadoEditadoO(empleadoObra);
                setNewEmpleadoO(empleadoObra);
                setModalType('edit');
                setIsModalOpen(true);
              }}
              setEmpleadoSeleccionadoO={(empleadoObra) => {
                setEmpleadoSeleccionadoO(empleadoObra);
                setModalType('delete');
                setIsDeleteModalOpen(true);
              }}
              setModalType={setModalType}
            />
          </div>
        );
      case "planta":
        return (
          <div>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition mb-4"
              onClick={() => {
                setModalType('add');
                setIsModalOpen(true);
              }}>
              Agregar Empleado Planta
            </button>
            <h2 className="text-2xl font-semibold mt-6 mb-4">Lista Empleados Planta</h2>
            <EmpleadoPlantaList
              empleadosP={empleadosP}
              setEmpleadoEditadoP={(empleadoPlanta) => {
                setEmpleadoEditadoP(empleadoPlanta);
                setNewEmpleadoP(empleadoPlanta);
                setModalType('edit');
                setIsModalOpen(true);
              }}
              setEmpleadoSeleccionadoP={(empleadoPlanta) => {
                setEmpleadoSeleccionadoP(empleadoPlanta);
                setModalType('delete');
                setIsDeleteModalOpen(true);
              }}
              setModalType={setModalType}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-500 text-gray-800 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">Gestión De Empleados</h1>
      <div className="flex items-center justify-center space-x-3 mb-6">
        <div className="relative w-64 h-12 bg-gray-300 rounded-full p-1 flex justify-between items-center cursor-pointer">
          <div className={`absolute top-1 bottom-1 w-32 bg-blue-500 rounded-full transition-transform duration-300 
      ${activeTab === 'obra' ? 'transform translate-x-0' : 'transform translate-x-full'}`} >
          </div>
          <span className={`flex-1 text-center text-black transition-colors duration-300 ${activeTab === 'obra' ? 'text-white' : 'text-gray-800'}`}
            onClick={() => setActiveTab('obra')} >
            Obra
          </span>
          <span className={`flex-1 text-center text-black transition-colors duration-300 ${activeTab === 'planta' ? 'text-white' : 'text-gray-800'}`}
            onClick={() => setActiveTab('planta')} >
            Planta
          </span>
        </div>
      </div>

      {renderContent()}

      {isModalOpen && (modalType === 'add' || modalType === 'edit') && (
        <Modal isOpen={isModalOpen} closeModal={closeModal}>
          {activeTab === 'obra' ? (
            <EmpleadoObraForm
              empleadoObra={newEmpleadoO}
              setEmpleadoObra={setNewEmpleadoO}
              onSave={saveObra}
              empleadoEditadoObra={empleadoEditadoO}
              handleInputChange={handleInputChange}
              closeModal={closeModal}
            />
          ) : (
            <EmpleadoPlantaForm
            empleadoPlanta={newEmpleadoP}
            setEmpleadoPlanta={setNewEmpleadoP}
            onSave={savePlanta}
            empleadoEditadoPlanta={empleadoEditadoP}
            handleInputChange={handleInputChange}
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
              onClick={activeTab === 'obra' ? deleteObra : deletePlanta}>
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
