import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const MaintenanceForm = ({ onSave, maintenanceEditado, closeModal }) => {
  const [employees, setEmployees] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/v1/employees`)
      .then(response => setEmployees(response.data))
      .catch(error => console.error('Error fetching employees:', error));

    if (maintenanceEditado) {
      setEditId(maintenanceEditado.idMaintenance);
    }
  }, [maintenanceEditado]);

  const initialValues = {
    relatedEntityId: maintenanceEditado ? maintenanceEditado.relatedEntityId : 0,
    relatedEntityType: maintenanceEditado ? maintenanceEditado.relatedEntityType : 'VEHICULO',
    employeeId: maintenanceEditado ? maintenanceEditado.employeeId : '',
    maintenanceType: maintenanceEditado ? maintenanceEditado.maintenanceType : '',
    description: maintenanceEditado ? maintenanceEditado.description : '',
    cost: maintenanceEditado ? maintenanceEditado.cost : 0,
    realizationDate: maintenanceEditado ? maintenanceEditado.realizationDate : '',
    nextDate: maintenanceEditado ? maintenanceEditado.nextDate : ''
  };

  const validationSchema = Yup.object().shape({
    relatedEntityId: Yup.number().required('El ID de la entidad relacionada es obligatorio'),
    relatedEntityType: Yup.string().required('El tipo de entidad es obligatorio'),
    employeeId: Yup.number().required('El empleado es obligatorio'),
    maintenanceType: Yup.string().required('El tipo de mantenimiento es obligatorio'),
    description: Yup.string().required('La descripción es obligatoria'),
    cost: Yup.number().required('El costo es obligatorio').positive('El costo debe ser positivo'),
    realizationDate: Yup.date().required('La fecha de realización es obligatoria'),
    nextDate: Yup.date().required('La próxima fecha es obligatoria')
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await onSave(values, editId);
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
      enableReinitialize={true}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-4 p-4 border rounded shadow-md">
          <div>
            <label className="block text-gray-700">ID del Vehiculo o Maquinaria</label>
            <Field
              type="number"
              name="relatedEntityId"
              className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
            />
            <ErrorMessage name="relatedEntityId" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <div>
            <label className="block text-gray-700">Tipo de Entidad Relacionada</label>
            <Field
              as="select"
              name="relatedEntityType"
              className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
            >
              <option value="VEHICULO">Vehículo</option>
              <option value="MAQUINARIA">Maquinaria</option>
            </Field>
            <ErrorMessage name="relatedEntityType" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <div>
            <label className="block text-gray-700">Empleado</label>
            <Field
              as="select"
              name="employeeId"
              className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
            >
              <option value="">Seleccione un empleado</option>
              {employees
                .filter(emp => emp.employeeType === 'PLANTA') // Filtra solo empleados de tipo 'PLANTA'
                .map(emp => (
                  <option key={emp.idEmployee} value={emp.idEmployee}>
                    {emp.name}
                  </option>
                ))}
            </Field>
            <ErrorMessage name="employeeId" component="div" className="text-red-500 text-sm mt-1" />
          </div>
          <div>
            <label className="block text-gray-700">Tipo de Mantenimiento</label>
            <Field
              as="textarea"
              name="maintenanceType"
              className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
            />
            <ErrorMessage name="maintenanceType" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <div>
            <label className="block text-gray-700">Descripción</label>
            <Field
              as="textarea"
              name="description"
              className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
            />
            <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <div>
            <label className="block text-gray-700">Costo</label>
            <Field
              type="number"
              name="cost"
              className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
            />
            <ErrorMessage name="cost" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <div>
            <label className="block text-gray-700">Fecha de Realización</label>
            <Field
              type="date"
              name="realizationDate"
              className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
            />
            <ErrorMessage name="realizationDate" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <div>
            <label className="block text-gray-700">Próxima Fecha</label>
            <Field
              type="date"
              name="nextDate"
              className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
            />
            <ErrorMessage name="nextDate" component="div" className="text-red-500 text-sm mt-1" />
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

export default MaintenanceForm;
