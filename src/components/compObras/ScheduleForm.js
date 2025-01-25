import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const ScheduleForm = ({ schedule, setSchedule, onSave, closeModal }) => {
  const initialValues = {
    name: schedule.name || "",
    description: schedule.description || "",
    status: schedule.status || "PENDIENTE", // Valor predeterminado "PENDIENTE"
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("El nombre del cronograma es obligatorio"),
    description: Yup.string().required("La descripción es obligatoria"),
    status: Yup.string()
      .oneOf(["PENDIENTE", "EN_PROGRESO", "COMPLETADO"], "Estado inválido")
      .required("El estado es obligatorio"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await onSave(values); // Llama a la función para guardar
    } catch (error) {
      console.error("Error al guardar el cronograma:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize={true}
    >
      {({ isSubmitting }) => (
        <Form>
          <div className="grid grid-cols-1 gap-4">
            {/* Nombre del cronograma */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300">Nombre del Cronograma</label>
              <Field
                type="text"
                name="name"
                minLength={0}
                maxLength={50}
                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
              />
              <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300">Descripción</label>
              <Field
                as="textarea"
                name="description"
                minLength={0}
                maxLength={255}
                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
              />
              <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Estado */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300">Estado</label>
              <Field
                as="select"
                name="status"
                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
              >
                <option value="PENDIENTE">Pendiente</option>
                <option value="EN_PROGRESO">En Progreso</option>
                <option value="COMPLETADO">Completado</option>
              </Field>
              <ErrorMessage name="status" component="div" className="text-red-500 text-sm mt-1" />
            </div>
          </div>

          {/* Botones */}
          <div className="mt-6 flex justify-end gap-4">
            <button
              type="button"
              className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition"
              onClick={closeModal}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ScheduleForm;