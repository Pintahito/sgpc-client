import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

const EmployeeAssignmentForm = ({ onSave, closeModal, apiUrl, hasResponsible, assignment }) => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/v1/employees/employees/id-and-name`
        );
        setEmployees(response.data);
      } catch (error) {
        console.error("Error al obtener empleados:", error);
      }
    };
    fetchEmployees();
  }, [apiUrl]);

  const initialValues = {
    role: assignment?.role || "",
    responsible: assignment ? assignment.responsible : !hasResponsible,
    status: assignment?.status || "ASIGNADO",
    employeeId: assignment?.idEmployee || "", // Ajuste aquí para usar `idEmployee`
  };

  const validationSchema = Yup.object().shape({
    role: Yup.string()
      .required("El rol es obligatorio")
      .min(3, "El rol debe tener al menos 3 caracteres"),
    status: Yup.string()
      .required("El estado es obligatorio")
      .oneOf(["ASIGNADO", "EN_PROGRESO", "COMPLETADO"], "Estado inválido"),
    employeeId: Yup.number()
      .required("Debe seleccionar un empleado")
      .min(1, "Debe seleccionar un empleado válido"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await onSave(values);
      closeModal();
    } catch (error) {
      console.error("Error al guardar la asignación:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // Título dinámico basado en `hasResponsible`
  const formTitle = assignment
    ? "Editar Asignación"
    : hasResponsible
    ? "Asignar Trabajador"
    : "Asignar Responsable";

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize // Permite actualizar los valores iniciales al editar
    >
      {({ isSubmitting, values }) => (
        <Form>
          {/* Título del formulario */}
          <h2 className="text-xl font-bold mb-4 text-center">{formTitle}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* Rol */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300">
                Rol
              </label>
              <Field
                type="text"
                name="role"
                placeholder="Ingrese el rol"
                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
              />
              <ErrorMessage
                name="role"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Responsable */}
            {values.responsible && (
              <div>
                <label className="block text-gray-700 dark:text-gray-300">
                  ¿Es responsable?
                </label>
                <Field
                  type="checkbox"
                  name="responsible"
                  className="mt-2 h-5 w-5 text-blue-500 border-gray-300 rounded"
                  disabled={assignment?.responsible} // Bloquear si está editando un responsable
                />
                <ErrorMessage
                  name="responsible"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
            )}

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
                <option value="ASIGNADO">Asignado</option>
                <option value="EN_PROGRESO">En Progreso</option>
                <option value="COMPLETADO">Completado</option>
              </Field>
              <ErrorMessage
                name="status"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Empleado */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300">
                Empleado
              </label>
              <Field
                as="select"
                name="employeeId"
                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
              >
                <option value="">Seleccione un empleado</option>
                {employees.map((employee) => (
                  <option key={employee.idEmployee} value={employee.idEmployee}>
                    {employee.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="employeeId"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
          </div>

          {/* Botones */}
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
              {isSubmitting ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default EmployeeAssignmentForm;