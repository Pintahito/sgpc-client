
import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const MaintenanceForm = ({ onSave, maintenanceEditado, closeModal }) => {
  const [employees, setEmployees] = useState([]);
  const [editId, setEditId] = useState(null);
  const [entityOptions, setEntityOptions] = useState([]);


  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/v1/employees`)
      .then(response => setEmployees(response.data))
      .catch(error => console.error('Error fetching employees:', error));

    if (maintenanceEditado) {
      setEditId(maintenanceEditado.idMaintenance);
    }
  }, [maintenanceEditado]);

  useEffect(() => {
    // Cargar opciones de entidades relacionadas según el tipo
    const fetchEntities = async () => {
      const relatedEntityType = maintenanceEditado
        ? maintenanceEditado.relatedEntityType
        : 'VEHICULO';

      const apiUrl =
        relatedEntityType === 'VEHICULO'
          ? '/api/v1/vehicles'
          : '/api/v1/machinery';

      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}${apiUrl}`);
        setEntityOptions(response.data);
      } catch (error) {
        console.error(`Error fetching ${relatedEntityType}:`, error);
      }
    };

    fetchEntities();
  }, [maintenanceEditado]);

  const initialValues = {
    relatedEntityId: maintenanceEditado ? maintenanceEditado.relatedEntityId : '',
    relatedEntityType: maintenanceEditado ? maintenanceEditado.relatedEntityType : 'VEHICULO',
    employeeId: maintenanceEditado ? maintenanceEditado.employeeId : '',
    maintenanceType: maintenanceEditado ? maintenanceEditado.maintenanceType : '',
    description: maintenanceEditado ? maintenanceEditado.description : '',
    cost: maintenanceEditado ? maintenanceEditado.cost : 0,
    realizationDate: maintenanceEditado ? maintenanceEditado.realizationDate : '',
    nextDate: maintenanceEditado ? maintenanceEditado.nextDate : ''
  };

  const validationSchema = Yup.object().shape({
    relatedEntityId: Yup.string().required('Seleccione una entidad relacionada'),
    relatedEntityType: Yup.string()
    .oneOf(['VEHICULO', 'MAQUINARIA'], 'Tipo de entidad no válido')
    .required('El tipo de entidad es obligatorio'),
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
      console.log("Datos enviados:", values);
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
      {({ values, setFieldValue,isSubmitting }) => (
        <Form className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {/* Tipo de Entidad Relacionada */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Tipo de Entidad Relacionada</label>
            <Field
              as="select"
              name="relatedEntityType"
              className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
              onChange={(e) => {
                setFieldValue('relatedEntityType', e.target.value);
                setFieldValue('relatedEntityId', ''); // Reinicia la selección de entidad
                const apiUrl =
                  e.target.value === 'VEHICULO'
                    ? '/api/v1/vehicles'
                    : '/api/v1/machinery';

                axios
                  .get(`${process.env.REACT_APP_API_URL}${apiUrl}`)
                  .then((response) => setEntityOptions(response.data))
                  .catch((error) => console.error(`Error fetching ${e.target.value}:`, error));
              }}
            >
              <option value="VEHICULO">Vehículo</option>
              <option value="MAQUINARIA">Maquinaria</option>
            </Field>
            <ErrorMessage name="relatedEntityType" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          {/* Entidad Relacionada */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Entidad Relacionada</label>
            <Field
              as="select"
              name="relatedEntityId"
              className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
            >
              <option value="">Seleccione una opción</option>
              {entityOptions.map((option) => (
                <option
                  key={
                    values.relatedEntityType === 'VEHICULO'
                      ? option.id_vehicle
                      : option.id_machinery
                  }
                  value={
                    values.relatedEntityType === 'VEHICULO'
                      ? option.id_vehicle
                      : option.id_machinery
                  }
                >
                  {option.name}
                </option>
              ))}
            </Field>
            <ErrorMessage name="relatedEntityId" component="div" className="text-red-500 text-sm mt-1" />
          </div>
          
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Empleado</label>
            <Field
              as="select"
              name="employeeId"
              className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
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
            <label className="block text-gray-700 dark:text-gray-300">Tipo de Mantenimiento</label>
            <Field
              as="textarea"
              name="maintenanceType"
              className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
            />
            <ErrorMessage name="maintenanceType" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300">Descripción</label>
            <Field
              as="textarea"
              name="description"
              className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
            />
            <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300">Costo</label>
            <Field
              type="number"
              name="cost"
              className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
            />
            <ErrorMessage name="cost" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300">Fecha de Realización</label>
            <Field
              type="date"
              name="realizationDate"
              className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
            />
            <ErrorMessage name="realizationDate" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300">Próxima Fecha</label>
            <Field
              type="date"
              name="nextDate"
              className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
            />
            <ErrorMessage name="nextDate" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <div className="mt-16 flex justify-end gap-6">
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
