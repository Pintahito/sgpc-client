import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';


// Santiago Priego Barrios


const ClienteForm = ({ cliente, setCliente, onSave, clienteEditado, closeModal }) => {
  useEffect(() => {
    if (clienteEditado) {
      setCliente(clienteEditado);
    }
  }, [clienteEditado, setCliente]);

  const initialValues = {
    name: cliente.name || '',
    address: cliente.address || '',
    municipality: cliente.municipality || '',
    state: cliente.state || '',
    phone: cliente.phone || '',
    email: cliente.email || '',
    rfc: cliente.rfc || '',
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await onSave(values); // Espera a que onSave se complete correctamente
      closeModal(); // Solo cierra el modal si se guardó correctamente
    } catch (error) {
      console.error("Error al guardar los datos:", error);
    } finally {
      setSubmitting(false); // Permite que el botón vuelva a estar habilitado
    }
  };
  

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('El nombre es obligatorio'),
    address: Yup.string().required('La dirección es obligatoria'),
    municipality: Yup.string().required('El municipio es obligatorio'),
    state: Yup.string().required('El estado es obligatorio'),
    phone: Yup.string()
      .required('El teléfono es obligatorio')
      .matches(/^\d+$/, 'El teléfono solo debe contener números'),
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
      enableReinitialize={false} // Permite reinicializar el formulario si los valores cambian
    >
      {({ isSubmitting }) => (
        <Form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300">Nombre</label>
              <Field
                type="text"
                name="name"
                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
              />
              <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300">Dirección</label>
              <Field
                type="text"
                name="address"
                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
              />
              <ErrorMessage name="address" component="div" className="text-red-500 text-sm mt-1" />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300">Municipio</label>
              <Field
                type="text"
                name="municipality"
                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
              />
              <ErrorMessage name="municipality" component="div" className="text-red-500 text-sm mt-1" />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300">Estado</label>
              <Field
                type="text"
                name="state"
                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
              />
              <ErrorMessage name="state" component="div" className="text-red-500 text-sm mt-1" />
            </div>
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
            <div>
              <label className="block text-gray-700 dark:text-gray-300">Email</label>
              <Field
                type="email"
                name="email"
                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
              />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
            </div>
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
              Guardar
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ClienteForm;
