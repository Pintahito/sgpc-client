import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const UserForm = ({ user, setUser, onSave, userEditado, closeModal }) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => { setShowPassword(!showPassword); };

  useEffect(() => {
    if (userEditado) {
      setUser(userEditado);
    }
  }, [userEditado, setUser]);

  const initialValues = {
    username: user.username || '',
    password: user.password || '',
    rolId: user.rolId || '',
    rolName: user.rolName || ''
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await onSave(values);
    } catch (error) {
      console.error("Error al guardar los datos:", error);
      console.log("Datos:", values);
    } finally {
      setSubmitting(false);
    }
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('El nombre de usuario es obligatorio'),
    password: Yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('La contraseña es obligatoria'),
    rolId: Yup.number().required('El rol es obligatorio').integer('Debe ser un número entero'),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize={false}
    >
      {({ isSubmitting }) => (
        <Form>
          <div className="grid grid-cols-1 gap-4">
            {/* Username */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300">Nombre de Usuario</label>
              <Field
                type="text"
                name="username"
                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
              />
              <ErrorMessage name="username" component="div" className="text-red-500 text-sm mt-1" />
            </div>
            {/* Password */}
            <div className="relative"> <label className="block text-gray-700 dark:text-gray-300">Contraseña</label>
              <Field type={showPassword ? "text" : "password"}
                name="password"
                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" />
              <span onClick={toggleShowPassword}
                className="absolute right-3 top-3 cursor-pointer text-gray-500 dark:text-gray-400" >
                {showPassword ? <FaEyeSlash /> : <FaEye />} </span> <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
            </div>
            {/* Rol ID */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300">ID del Rol</label>
              <Field
                type="number"
                name="rolId"
                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
              />
              <ErrorMessage name="rolId" component="div" className="text-red-500 text-sm mt-1" />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300">Rol</label>
              <Field
                type="text"
                name="rolName"
                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
              />
              <ErrorMessage name="rolName" component="div" className="text-red-500 text-sm mt-1" />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <button
              type="button"
              className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition"
              onClick={closeModal}>
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
              disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default UserForm;
