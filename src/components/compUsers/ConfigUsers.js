import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RoleList from './RoleList';
import RoleForm from './RoleForm';
import UserList from './UserList';
import UserForm from './UserForm';
import Modal from './Modal';
import Swal from 'sweetalert2';

const apiUrl = process.env.REACT_APP_API_URL;
console.log(apiUrl);

const ConfigUsers = () => {

  //Global Config
  const [activeTab, setActiveTab] = useState("users");
  const [modalType, setModalType] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  //Roles 
  const [roles, setRoles] = useState([]);
  const [roleEditado, setRoleEditado] = useState(null);
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
        Swal.fire({
          title: "¡Rol editado con éxito!",
          icon: "success",
          draggable: true
        });
      } else {
        await axios.post(`${apiUrl}/api/v1/roles`, values);
        Swal.fire({
          title: "¡Rol agregado con éxito!",
          icon: "success",
          draggable: true
        });
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
      fetchRoles();
      closeDeleteModal();
    } catch (error) {
      Swal.fire('¡Hay otra tabla dependiendo de esta!');
      console.error('Error al eliminar rol:', error);
    }
  };

  //Users Config
  const [users, setUsers] = useState([]);
  const [userEditado, setUserEditado] = useState(null);
  const [userSeleccionado, setUserSeleccionado] = useState(null);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    rolId: 0,
    rolName: ''
  });

  // Obtener todos los usuarios
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      if (error.response?.status === 403) {
        Swal.fire('Acceso denegado', 'Token inválido o no autorizado', 'error');
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Crear o actualizar un usuario
  const saveUser = async (values) => {
    try {
      if (userEditado) {
        await axios.put(`${apiUrl}/api/v1/users/${userEditado.id_user}`, values);
        Swal.fire({
          title: "¡Usuario editado con éxito!",
          icon: "success",
          draggable: true
        });
      } else {
        await axios.post(`${apiUrl}/api/v1/users`, values);
        Swal.fire({
          title: "¡Usuario agregado con éxito!",
          icon: "success",
          draggable: true
        });
      }
      fetchUsers();
      closeModal();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Verifica tus datos!',
      });
      console.error('Error al guardar usuario:', error);
    }
  };

  // Eliminar un usuario
  const deleteUser = async () => {
    try {
      await axios.delete(`${apiUrl}/api/v1/users/${userSeleccionado.id_user}`);
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
      fetchUsers();
      closeDeleteModal();
    } catch (error) {
      Swal.fire('¡Hay otra tabla dependiendo de este usuario!');
      console.error('Error al eliminar usuario:', error);
    }
  };

  // Cerrar modal y resetear formulario
  const closeModal = () => {
    setIsModalOpen(false);
    //Roles
    setRoleEditado(null);
    setNewRole({ name: '' });
    //Users
    setUserEditado(null);
    setNewUser({ username: '', password: '', rolId: 0, rolName: '' });

  };

  // Cerrar modal de eliminación
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setRoleSeleccionado(null);
    setUserSeleccionado(null);
  };

  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    setNewRole({ ...newRole, [e.target.name]: e.target.value });
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    fetchRoles();
    fetchUsers();
  }, []);

  // Renderizado de contenido según la pestaña activa
  const renderContent = () => {
    switch (activeTab) {
      case "users":
        return (
          <div>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition mb-4"
              onClick={() => {
                setModalType('add');
                setIsModalOpen(true);
              }}>
              Agregar Usuarios
            </button>
            <h2 className="text-2xl font-semibold mt-6 mb-4">Lista de Usuarios</h2>
            <UserList
              users={users}
              setUserEditado={(user) => {
                setUserEditado(user);
                setNewUser(user);
                setModalType('edit');
                setIsModalOpen(true);
              }}
              setUserSeleccionado={(user) => {
                setUserSeleccionado(user);
                setModalType('delete');
                setIsDeleteModalOpen(true);
              }}
              setModalType={setModalType}
            />
          </div>
        );
      case "roles":
        return (
          <div>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition mb-4"
              onClick={() => {
                setModalType('add');
                setIsModalOpen(true);
              }}>
              Agregar Roles
            </button>
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
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-500 text-gray-800 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">Gestión De Usuarios Y Roles</h1>
      <div className="flex items-center justify-center space-x-3 mb-6">
        <div className="relative w-64 h-12 bg-gray-300 rounded-full p-1 flex justify-between items-center cursor-pointer">
          <div className={`absolute top-1 bottom-1 w-32 bg-blue-500 rounded-full transition-transform duration-300 
      ${activeTab === 'users' ? 'transform translate-x-0' : 'transform translate-x-full'}`} >
          </div>
          <span className={`flex-1 text-center text-black transition-colors duration-300 ${activeTab === 'users' ? 'text-white' : 'text-gray-800'}`}
            onClick={() => setActiveTab('users')} >
            Usuarios
          </span>
          <span className={`flex-1 text-center text-black transition-colors duration-300 ${activeTab === 'roles' ? 'text-white' : 'text-gray-800'}`}
            onClick={() => setActiveTab('roles')} >
            Roles
          </span>
        </div>
      </div>

      {renderContent()}

      {isModalOpen && (modalType === 'add' || modalType === 'edit') && (
        <Modal isOpen={isModalOpen} closeModal={closeModal}>
          {activeTab === 'users' ? (
            <UserForm
              user={newUser}
              setUser={setNewUser}
              onSave={saveUser}
              userEditado={userEditado}
              handleInputChange={handleInputChange}
              closeModal={closeModal}
            />
          ) : (
            <RoleForm
              role={newRole}
              setRole={setNewRole}
              onSave={saveRole}
              roleEditado={roleEditado}
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
              onClick={activeTab === 'users' ? deleteUser : deleteRole}>
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

export default ConfigUsers;
