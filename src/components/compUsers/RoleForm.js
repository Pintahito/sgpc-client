import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const RoleForm = ({ role, setRole, onSave, roleEditado, closeModal }) => {
  useEffect(() => {
    if (roleEditado) {
      setRole(roleEditado);
    }
  }, [roleEditado, setRole]);

  const initialValues = {
    name: role.name || '',
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await onSave(values);
    } catch (error) {
      console.error("Error al guardar los datos:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('El nombre es obligatorio'),
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
            {/* Nombre */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300">Nombre</label>
              <Field
                minLength={0}
                maxLength={100}
                type="text"
                name="name"
                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
              />
              <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
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

export default RoleForm;
