import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const ProveedorForm = ({ proveedor, setProveedor, onSave, proveedorEditado, closeModal }) => {
  useEffect(() => {
    if (proveedorEditado) {
      setProveedor(proveedorEditado);
    }
  }, [proveedorEditado, setProveedor]);

  const initialValues = {
    name: proveedor.name || '',
    address: proveedor.address || '',
    phone: proveedor.phone || '',
    email: proveedor.email || '',
    rfc: proveedor.rfc || '',
    created_at: proveedor.created_at || '',
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
    address: Yup.string().required('La dirección es obligatoria'),
    phone: Yup.string()
      .required('El teléfono es obligatorio')
      .matches(/^\d+$/, 'El teléfono solo debe contener números')
      .min(10, 'El teléfono debe tener exactamente 10 dígitos')
      .max(10, 'El teléfono debe tener exactamente 10 dígitos'),
    email: Yup.string()
      .email('Correo electrónico inválido')
      .required('El correo es obligatorio'),
    rfc: Yup.string()
      .required('El RFC es obligatorio')
      .matches(/^([A-ZÑ&]{3,4}) ?(?:-?(\d{2})(\d{2})(\d{2})) ?((?:[A-Z\d]{3}))$/, 'El RFC no es válido'),
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300">Nombre Del Proveedor</label>
              <Field
                minLength={0}
                maxLength={100}
                type="text"
                name="name"
                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
              />
              <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
            </div>
            {/* Dirección */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300">Dirección</label>
              <Field
                minLength={0}
                maxLength={100}
                as="textarea"
                name="address"
                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
              />
              <ErrorMessage name="address" component="div" className="text-red-500 text-sm mt-1" />
            </div>
            {/* Teléfono */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300">Teléfono</label>
              <Field
                minLength={10}
                maxLength={10}
                type="text"
                name="phone"
                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
              />
              <ErrorMessage name="phone" component="div" className="text-red-500 text-sm mt-1" />
            </div>
            {/* Email */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300">Email</label>
              <Field
                minLength={0}
                maxLength={50}
                type="email"
                name="email"
                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
              />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
            </div>
            {/* RFC */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300">RFC</label>
              <Field
                minLength={13}
                maxLength={13}
                type="text"
                name="rfc"
                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
              />
              <ErrorMessage name="rfc" component="div" className="text-red-500 text-sm mt-1" />
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

export default ProveedorForm;
