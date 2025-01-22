import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

const ScheduledActivityForm = ({
  scheduledActivity,
  setScheduledActivity,
  onSave,
  closeModal,
  apiUrl,
}) => {
  const [activities, setActivities] = useState([]); // Estado para almacenar actividades

  useEffect(() => {
    if (scheduledActivity) {
      setScheduledActivity(scheduledActivity);
    }
  }, [scheduledActivity, setScheduledActivity]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/v1/activities`);
        setActivities(response.data); // Actualizar estado con las actividades
      } catch (error) {
        console.error("Error al obtener actividades:", error);
      }
    };
    fetchActivities();
  }, [apiUrl]);

  const initialValues = {
    estimatedStartDate: scheduledActivity?.estimatedStartDate || "",
    estimatedEndDate: scheduledActivity?.estimatedEndDate || "",
    actualStartDate: scheduledActivity?.actualStartDate || "",
    actualEndDate: scheduledActivity?.actualEndDate || "",
    priority: scheduledActivity?.priority || 1,
    status: scheduledActivity?.status || "PLANIFICADA",
    activityId: scheduledActivity?.activityId || "",
  };

  const validationSchema = Yup.object().shape({
    estimatedStartDate: Yup.date().required(
      "La fecha estimada de inicio es obligatoria"
    ),
    estimatedEndDate: Yup.date()
      .required("La fecha estimada de finalización es obligatoria")
      .min(
        Yup.ref("estimatedStartDate"),
        "La fecha de finalización debe ser posterior a la fecha de inicio"
      ),
    actualStartDate: Yup.date().nullable(),
    actualEndDate: Yup.date()
      .nullable()
      .min(
        Yup.ref("actualStartDate"),
        "La fecha de finalización real debe ser posterior a la fecha de inicio real"
      ),
    priority: Yup.number()
      .required("La prioridad es obligatoria")
      .oneOf([1, 2, 3], "La prioridad debe ser Baja (1), Media (2) o Alta (3)"),
    status: Yup.string()
      .required("El estado es obligatorio")
      .oneOf(
        ["PLANIFICADA", "EN_PROGRESO", "COMPLETADA", "CANCELADA"],
        "Estado inválido"
      ),
    activityId: Yup.string()
      .required("Debe seleccionar una actividad")
      .min(1, "Debe seleccionar una actividad válida"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Mapea los datos del formulario al formato esperado por el backend
      const payload = {
        ...values,
        idActivity: values.activityId, // Mapea activityId a idActivity
      };
  
      console.log("Payload enviado:", payload); // Verifica el payload antes de enviarlo
      await onSave(payload); // Envía los datos al backend
    } catch (error) {
      console.error("Error al guardar los datos:", error);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ isSubmitting }) => (
        <Form>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mt-4">
            {/* Fechas estimadas */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300">
                Fecha estimada de inicio
              </label>
              <Field
                type="date"
                name="estimatedStartDate"
                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
              />
              <ErrorMessage
                name="estimatedStartDate"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300">
                Fecha estimada de finalización
              </label>
              <Field
                type="date"
                name="estimatedEndDate"
                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
              />
              <ErrorMessage
                name="estimatedEndDate"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Fechas reales */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300">
                Fecha de inicio real
              </label>
              <Field
                type="date"
                name="actualStartDate"
                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
              />
              <ErrorMessage
                name="actualStartDate"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300">
                Fecha de finalización real
              </label>
              <Field
                type="date"
                name="actualEndDate"
                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
              />
              <ErrorMessage
                name="actualEndDate"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Prioridad */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300">
                Prioridad
              </label>
              <Field
                as="select"
                name="priority"
                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
              >
                <option value={1}>Baja</option>
                <option value={2}>Media</option>
                <option value={3}>Alta</option>
              </Field>
              <ErrorMessage
                name="priority"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Estado */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300">
                Estado
              </label>
              <Field
                as="select"
                name="status"
                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
              >
                <option value="PLANIFICADA">Planificada</option>
                <option value="EN_PROGRESO">En Progreso</option>
                <option value="COMPLETADA">Completada</option>
                <option value="CANCELADA">Cancelada</option>
              </Field>
              <ErrorMessage
                name="status"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Selección de actividad */}
            <div className="col-span-2">
              <label className="block text-gray-700 dark:text-gray-300">
                Actividad
              </label>
              <Field
                as="select"
                name="activityId"
                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
              >
                <option value="">Selecciona una actividad</option>
                {activities.map((act) => (
                  <option key={act.idActivity} value={act.idActivity}>
                    {act.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="activityId"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
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

export default ScheduledActivityForm;
