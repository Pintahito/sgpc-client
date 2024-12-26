import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import UserList from './UserList';
import UserForm from './UserForm';
import Modal from './Modal';
import Swal from 'sweetalert2';

const apiUrl = process.env.REACT_APP_API_URL;
console.log(apiUrl);

const Users = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);

  const [users, setUsers] = useState([]);
  const [userEditado, setUserEditado] = useState(null);
  const [userSeleccionado, setUserSeleccionado] = useState(null);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    rol_id: '' 
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
        await axios.put(`${apiUrl}/api/v1/users/${userEditado.id}`, values);
        Swal.fire('¡Usuario editado con éxito!');
      } else {
        await axios.post(`${apiUrl}/api/v1/users`, values);
        Swal.fire('¡Usuario agregado con éxito!');
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
      await axios.delete(`${apiUrl}/api/v1/users/${userSeleccionado.id}`);
      Swal.fire('¡Usuario eliminado con éxito!');
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
    setUserEditado(null);
    setNewUser({ username: '', password: '', rol_id: '' });
  };

  // Cerrar modal de eliminación
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setUserSeleccionado(null);
  };

  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-500 text-gray-800 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">Gestión de Usuarios</h1>

      <button
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
        onClick={() => {
          setModalType('add');
          setIsModalOpen(true);
        }}
      >
        Agregar Usuario
      </button>

      {isModalOpen && modalType === 'add' && (
        <Modal closeModal={closeModal}>
          <UserForm
            user={newUser}
            setUser={setNewUser}
            onSave={saveUser}
            userEditado={userEditado}
            handleInputChange={handleInputChange}
            closeModal={closeModal}
          />
        </Modal>
      )}

      {isModalOpen && modalType === 'edit' && (
        <Modal closeModal={closeModal}>
          <UserForm
            user={newUser}
            setUser={setNewUser}
            onSave={saveUser}
            userEditado={userEditado}
            handleInputChange={handleInputChange}
            closeModal={closeModal}
          />
        </Modal>
      )}

      {isDeleteModalOpen && modalType === 'delete' && (
        <Modal closeModal={closeDeleteModal}>
          <div className="text-center">
            <p className="mb-4">
              ¿Estás seguro de que deseas eliminar el usuario {userSeleccionado?.username}?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition"
                onClick={deleteUser}
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
};

export default Users;
