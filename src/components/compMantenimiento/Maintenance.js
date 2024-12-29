import React, { useState, useEffect } from 'react';
import axios from 'axios';

import MaintenanceForm from './MaintenanceForm';
import MaintenanceList from './MaintenanceList';
import Modal from './Modal';
import Swal from 'sweetalert2';

const apiUrl = process.env.REACT_APP_API_URL;

const Maintenance = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);

  const [maintenances, setMaintenances] = useState([]);
  const [maintenanceEditado, setMaintenanceEditado] = useState(null);
  const [maintenanceSeleccionado, setMaintenanceSeleccionado] = useState(null);

  const [newMaintenance, setNewMaintenance] = useState({
    relatedEntityId: 0,
    relatedEntityType: 'VEHICLE',
    employeeId: 0,
    maintenanceType: '',
    employeeName: '',
    description: '',
    cost: 0,
    realizationDate: '',
    nextDate: ''
  });

  const fetchMaintenances = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/maintenance`);
      setMaintenances(response.data);
    } catch (error) {
      console.error('Error al obtener los registros de mantenimiento:', error);
    }
  };

  const saveMaintenance = async (values) => {
    try {
      if (maintenanceEditado) {
        await axios.put(`${apiUrl}/api/v1/maintenance/${maintenanceEditado.idMaintenance}`, values);
        Swal.fire('¡Mantenimiento editado con éxito!');
      } else {
        await axios.post(`${apiUrl}/api/v1/maintenance`, values);
        Swal.fire('¡Mantenimiento agregado con éxito!');
      }
      fetchMaintenances();
      closeModal();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Error al guardar el mantenimiento.',
      });
      console.error('Error al guardar mantenimiento:', error);
    }
  };

  const deleteMaintenance = async () => {
    try {
      await axios.delete(`${apiUrl}/api/v1/maintenance/${maintenanceSeleccionado.idMaintenance}`);
      Swal.fire('¡Mantenimiento eliminado con éxito!');
      fetchMaintenances();
      closeDeleteModal();
    } catch (error) {
      console.error('Error al eliminar mantenimiento:', error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setMaintenanceEditado(null);
    setNewMaintenance({
      relatedEntityId: 0,
      relatedEntityType: 'VEHICLE',
      employeeId: 0,
      employeeName: '',
      maintenanceType: '',
      description: '',
      cost: 0,
      realizationDate: '',
      nextDate: ''
    });
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setMaintenanceSeleccionado(null);
  };

  useEffect(() => {
    fetchMaintenances();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-500 text-gray-800 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">Gestión de Mantenimiento</h1>

      <div>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition mb-4"
          onClick={() => {
            setModalType('add');
            setIsModalOpen(true);
          }}
        >
          Agregar Mantenimiento
        </button>
        <MaintenanceList
          maintenances={maintenances}
          setMaintenanceEditado={(maintenance) => {
            setMaintenanceEditado(maintenance);
            setNewMaintenance(maintenance);
            setModalType('edit');
            setIsModalOpen(true);
          }}
          setMaintenanceSeleccionado={(maintenance) => {
            setMaintenanceSeleccionado(maintenance);
            setModalType('delete');
            setIsDeleteModalOpen(true);
          }}
          setModalType={setModalType}
        />
      </div>

      {isModalOpen && (modalType === 'add' || modalType === 'edit') && (
        <Modal isOpen={isModalOpen} closeModal={closeModal}>
          <MaintenanceForm
            maintenance={newMaintenance}
            setMaintenance={setNewMaintenance}
            onSave={saveMaintenance}
            maintenanceEditado={maintenanceEditado}
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
              onClick={deleteMaintenance}
            >
              Eliminar
            </button>
            <button
              className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400"
              onClick={closeDeleteModal}
            >
              Cancelar
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Maintenance;
