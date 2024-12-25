import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RoleList from './RoleList';
import RoleForm from './RoleForm';
import Modal from './Modal';
import Swal from 'sweetalert2';

const apiUrl = process.env.REACT_APP_API_URL;
console.log(apiUrl);

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [roleEditado, setRoleEditado] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [roleSeleccionado, setRoleSeleccionado] = useState(null);
  const [newRole, setNewRole] = useState({
    name: '',
  });

  // Obtener todos los roles
  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/roles`);
      setRoles(response.data);
    } catch (error) {
      console.error('Error al obtener roles:', error);
      if (error.response?.status === 403) {
        Swal.fire('Acceso denegado', 'Token inválido o no autorizado', 'error');
      }
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // Crear o actualizar un rol
  const saveRole = async (values) => {
    try {
      if (roleEditado) {
        await axios.put(`${apiUrl}/api/v1/roles/${roleEditado.id_rol}`, values);
        Swal.fire('¡Rol editado con éxito!');
      } else {
        await axios.post(`${apiUrl}/api/v1/roles`, values);
        Swal.fire('¡Rol agregado con éxito!');
      }
      fetchRoles();
      closeModal();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Verifica tus datos!',
      });
      console.error('Error al guardar rol:', error);
    }
  };

  // Eliminar un rol
  const deleteRole = async () => {
    try {
      await axios.delete(`${apiUrl}/api/v1/roles/${roleSeleccionado.id_rol}`);
      Swal.fire('¡Rol eliminado con éxito!');
      fetchRoles();
      closeDeleteModal();
    } catch (error) {
      Swal.fire('¡Hay otra tabla dependiendo de esta!');
      console.error('Error al eliminar rol:', error);
    }
  };

  // Cerrar modal y resetear formulario
  const closeModal = () => {
    setIsModalOpen(false);
    setRoleEditado(null);
    setNewRole({ name: '' });
  };

  // Cerrar modal de eliminación
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setRoleSeleccionado(null);
  };

  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    setNewRole({ ...newRole, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-500 text-gray-800 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">Gestión de Roles</h1>

      <button
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
        onClick={() => {
          setModalType('add');
          setIsModalOpen(true);
        }}
      >
        Agregar Rol
      </button>

      {isModalOpen && modalType === 'add' && (
        <Modal closeModal={closeModal}>
          <RoleForm
            role={newRole}
            setRole={setNewRole}
            onSave={saveRole}
            roleEditado={roleEditado}
            handleInputChange={handleInputChange}
            closeModal={closeModal}
          />
        </Modal>
      )}

      {isModalOpen && modalType === 'edit' && (
        <Modal closeModal={closeModal}>
          <RoleForm
            role={newRole}
            setRole={setNewRole}
            onSave={saveRole}
            roleEditado={roleEditado}
            handleInputChange={handleInputChange}
            closeModal={closeModal}
          />
        </Modal>
      )}

      {isDeleteModalOpen && modalType === 'delete' && (
        <Modal closeModal={closeDeleteModal}>
          <div className="text-center">
            <p className="mb-4">
              ¿Estás seguro de que deseas eliminar el rol {roleSeleccionado?.name}?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition"
                onClick={deleteRole}
              >
                Eliminar
              </button>
              <button
                className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition"
                onClick={closeDeleteModal}
              >
                Cancelar
              </button>
            </div>
          </div>
        </Modal>
      )}

      <h2 className="text-2xl font-semibold mt-6 mb-4">Lista de Roles</h2>
      <RoleList
        roles={roles}
        setRoleEditado={(role) => {
          setRoleEditado(role);
          setNewRole(role);
          setModalType('edit');
          setIsModalOpen(true);
        }}
        setRoleSeleccionado={(role) => {
          setRoleSeleccionado(role);
          setModalType('delete');
          setIsDeleteModalOpen(true);
        }}
        setModalType={setModalType}
      />
    </div>
  );
};

export default Roles;
