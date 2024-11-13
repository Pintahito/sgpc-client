import React, { useState, useEffect } from 'react';
import axios from 'axios';

import VehiculoForm from './VehiculosForm';
import VehiculoList from './VehiculosList';
import MaquinariaForm from './MaquinariaForm';
import MaquinariaList from './MaquinariaList';

import Modal from './Modal';
import Swal from 'sweetalert2';

const apiUrl = process.env.REACT_APP_API_URL;
console.log(apiUrl);

const Maquinaria = () => {
  const [activeTab, setActiveTab] = useState("maquinaria");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);

  // Estados de Maquinaria
  const [maquinarias, setMaquinarias] = useState([]);
  const [maquinariaEditada, setMaquinariaEditada] = useState(null);
  const [maquinariaSeleccionada, setMaquinariaSeleccionada] = useState(null);
  const [newMaquinaria, setNewMaquinaria] = useState({
    nombre: '',
    marca: '',
    modelo: '',
    serial: '',
    fechaAdquisicion: '',
    costo: 0,
    estado: ''
  });

  // Estados de Vehículos
  const [vehiculos, setVehiculos] = useState([]);
  const [vehiculoEditado, setVehiculoEditado] = useState(null);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);
  const [newVehiculo, setNewVehiculo] = useState({
    marca: '',
    modelo: '',
    placas: '',
    color: '',
    ano: '',
    serial: '',
    estado: ''
  });

  // Funciones para Maquinaria
  const fetchMaquinarias = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/maquinaria`);
      setMaquinarias(response.data);
    } catch (error) {
      console.error('Error al obtener la maquinaria:', error);
    }
  };

  const saveMaquinaria = async (values) => {
    try {
      if (maquinariaEditada) {
        await axios.put(`${apiUrl}/api/v1/maquinaria/${maquinariaEditada.id}`, values);
        Swal.fire("¡Maquinaria editada con éxito!");
      } else {
        await axios.post(`${apiUrl}/api/v1/maquinaria`, values);
        Swal.fire("¡Maquinaria agregada con éxito!");
      }
      fetchMaquinarias();
      closeModal();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error al guardar la maquinaria.",
      });
      console.error('Error al guardar maquinaria:', error);
    }
  };

  const deleteMaquinaria = async () => {
    try {
      await axios.delete(`${apiUrl}/api/v1/maquinaria/${maquinariaSeleccionada.id}`);
      Swal.fire("¡Maquinaria eliminada con éxito!");
      fetchMaquinarias();
      closeDeleteModal();
    } catch (error) {
      console.error('Error al eliminar maquinaria:', error);
    }
  };

  // Funciones para Vehículos
  const fetchVehiculos = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/vehiculos`);
      setVehiculos(response.data);
    } catch (error) {
      console.error('Error al obtener los vehículos:', error);
    }
  };

  const saveVehiculo = async (values) => {
    try {
      if (vehiculoEditado) {
        await axios.put(`${apiUrl}/api/v1/vehiculos/${vehiculoEditado.id}`, values);
        Swal.fire("¡Vehículo editado con éxito!");
      } else {
        await axios.post(`${apiUrl}/api/v1/vehiculos`, values);
        Swal.fire("¡Vehículo agregado con éxito!");
      }
      fetchVehiculos();
      closeModal();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error al guardar el vehículo.",
      });
      console.error('Error al guardar vehículo:', error);
    }
  };

  const deleteVehiculo = async () => {
    try {
      await axios.delete(`${apiUrl}/api/v1/vehiculos/${vehiculoSeleccionado.id}`);
      Swal.fire("¡Vehículo eliminado con éxito!");
      fetchVehiculos();
      closeDeleteModal();
    } catch (error) {
      console.error('Error al eliminar vehículo:', error);
    }
  };

  // Manejo de modales
  const closeModal = () => {
    setIsModalOpen(false);
    setMaquinariaEditada(null);
    setVehiculoEditado(null);
    setNewMaquinaria({
      nombre: '',
      marca: '',
      modelo: '',
      serial: '',
      fechaAdquisicion: '',
      costo: 0,
      estado: ''
    });
    setNewVehiculo({
      marca: '',
      modelo: '',
      placas: '',
      color: '',
      ano: '',
      serial: '',
      estado: ''
    });
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setMaquinariaSeleccionada(null);
    setVehiculoSeleccionado(null);
  };

    // Manejar cambios en los inputs
    const handleInputChange = (e) => {
      setNewVehiculo({ ...newVehiculo, [e.target.marca]: e.target.value });
      setNewMaquinaria({...newMaquinaria,[e.target.nombre]:e.target.value});
    };

  useEffect(() => {
    fetchMaquinarias();
    fetchVehiculos();
  }, []);

  // Renderizado de contenido según la pestaña activa
  const renderContent = () => {
    switch (activeTab) {
      case "maquinaria":
        return (
          <div>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition mb-4"
              onClick={() => {
                setModalType('add');
                setIsModalOpen(true);
              }}>
              Agregar Maquinaria
            </button>
            <MaquinariaList
              maquinarias={maquinarias}
              setMaquinariaEditada={(maquinaria) => {
                setMaquinariaEditada(maquinaria);
                setNewMaquinaria(maquinaria);
                setModalType('edit');
                setIsModalOpen(true);
              }}
              setMaquinariaSeleccionada={(maquinaria) => {
                setMaquinariaSeleccionada(maquinaria);
                setModalType('delete');
                setIsDeleteModalOpen(true);
              }}
              setModalType={setModalType} // Pasar el setModalType
            />
          </div>
        );
      case "vehiculos":
        return (
          <div>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition mb-4"
              onClick={() => {
                setModalType('add');
                setIsModalOpen(true);
              }}>
              Agregar Vehículo
            </button>
            <VehiculoList
              vehiculos={vehiculos}
              setVehiculoEditado={(vehiculo) => {
                setVehiculoEditado(vehiculo);
                setNewVehiculo(vehiculo);
                setModalType('edit');
                setIsModalOpen(true);
              }}
              setVehiculoSeleccionado={(vehiculo) => {
                setVehiculoSeleccionado(vehiculo);
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
      <h1 className="text-3xl font-bold mb-6">Gestión de Maquinaria y Vehículos</h1>

      <div className="flex justify-center space-x-4 mb-6">
        <button
          className={`py-2 px-4 rounded-md transform transition-all duration-200 ${activeTab === 'maquinaria' ? 'bg-blue-500 text-white scale-105' : 'bg-gray-300 text-gray-800'} hover:scale-110`}
          onClick={() => setActiveTab("maquinaria")}>
          Maquinaria
        </button>
        <button
          className={`py-2 px-4 rounded-md transform transition-all duration-200 ${activeTab === 'vehiculos' ? 'bg-blue-500 text-white scale-105' : 'bg-gray-300 text-gray-800'} hover:scale-110`}
          onClick={() => setActiveTab("vehiculos")}>
          Vehículos
        </button>
      </div>

      {renderContent()}

      {isModalOpen && (modalType === 'add' || modalType === 'edit') && (
        <Modal isOpen={isModalOpen} closeModal={closeModal}>
          {activeTab === 'maquinaria' ? (
            <MaquinariaForm
              maquinaria={newMaquinaria}
              setMaquinaria={setNewMaquinaria}
              onSave={saveMaquinaria}
              maquinariaEditada={maquinariaEditada}
              handleInputChange={handleInputChange}
              closeModal={closeModal}
            />
          ) : (
            <VehiculoForm
              vehiculo={newVehiculo}
              setVehiculo={setNewVehiculo}
              onSave={saveVehiculo}
              vehiculoEditado={vehiculoEditado}
              handleInputChange={handleInputChange}
              initialValues={newVehiculo}
              closeModal={closeModal}
            />
          )}
        </Modal>
      )}

      {isDeleteModalOpen && (
        <Modal isOpen={isDeleteModalOpen} closeModal={closeDeleteModal}>
          <p>¿Estás seguro de que deseas eliminar este artículo?</p>
          <div className="flex justify-end mt-4">
            <button
              className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 mr-2"
              onClick={activeTab === 'maquinaria' ? deleteMaquinaria : deleteVehiculo}>
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

export default Maquinaria;
