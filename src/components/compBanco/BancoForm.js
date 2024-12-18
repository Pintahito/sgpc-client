import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const BancoForm = ({ banco, setBanco, onSave, bancoEditado, closeModal }) => {
  useEffect(() => {
    if (bancoEditado) {
      setBanco(bancoEditado);
    }
  }, [bancoEditado, setBanco]);

  // Valores iniciales
  const initialValues = {
    name: banco.name || '',
  };

  // Manejar envío del formulario
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await onSave(values);
    } catch (error) {
      console.error("Error al guardar los datos del banco:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // Esquema de validación
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('El nombre del banco es obligatorio'),
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
            {/* Campo Nombre */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300">Nombre del Banco</label>
              <Field
                type="text"
                name="name"
                maxlength="10"
                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
              />
              <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <button
              type="button"
              className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition"
              onClick={closeModal}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default BancoForm;
