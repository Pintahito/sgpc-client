import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const EmpleadoForm = ({ empleado, setEmpleado, onSave, empleadoEditado, closeModal }) => {
    useEffect(() => {
        if (empleadoEditado) {
            setEmpleado(empleadoEditado);
        }
    }, [empleadoEditado, setEmpleado]);

    const initialValues = {
        name: empleado.name || '',
        rfc: empleado.rfc || '',
        email: empleado.email || '',
        hiringDate: empleado.hiringDate || '',
        employeeType: empleado.employeeType || '',
        state: empleado.state || '',
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
        rfc: Yup.string().required('El RFC es obligatorio')
        .matches(/^([A-ZÑ&]{3,4}) ?(?:-?(\d{2})(\d{2})(\d{2})) ?((?:[A-Z\d]{3}))$/, 'El RFC no es válido'),
        email: Yup.string()
        .email('El formato del correo no es válido')
        .matches(/^[^@]+@[^@]+\.[^@.]+$/, 'El correo debe contener un punto en el dominio')
        .required('El email es obligatorio'),
        hiringDate: Yup.string().required('La fecha es obligatoria'),
        employeeType: Yup.string()
        .oneOf(['PLANTA', 'CONSTRUCCION'], 'Selecciona un tipo empleado válido')
        .required('El tipo es obligatorio'),
        state: Yup.string()
            .oneOf(['ACTIVO', 'INACTIVO'], 'Selecciona un estado válido')
            .required('El estado es obligatorio'),
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
                            <label className="block text-gray-700 dark:text-gray-300">Nombre</label>
                            <Field
                                type="text"
                                name="name"
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                            />
                            <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        {/* RFC */}
                        <div className="md:col-span-2">
                            <label className="block text-gray-700 dark:text-gray-300">RFC</label>
                            <Field
                                type="text"
                                name="rfc"
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                            />
                            <ErrorMessage name="rfc" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        {/* email*/}
                        <div className="md:col-span-2">
                            <label className="block text-gray-700 dark:text-gray-300">Email</label>
                            <Field
                                type="text"
                                name="email"
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                            />
                            <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        {/* Estado */}
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300">Estado</label>
                            <Field
                                as="select"
                                name="state"
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                            >
                                <option value="">Selecciona un estado</option>
                                <option value="ACTIVO">Activo</option>
                                <option value="INACTIVO">Inactivo</option>
                                <option value="VACANTE">Vacante</option>
                            </Field>
                            <ErrorMessage name="state" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        {/* employeeType */}
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300">Tipo Empleado</label>
                            <Field
                                as="select"
                                name="employeeType"
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                            >
                                <option value="">Selecciona un estado</option>
                                <option value="PLANTA">Planta</option>
                                <option value="CONSTRUCCION">Construccion</option>
                            </Field>
                            <ErrorMessage name="employeeType" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        {/* hiringDate */}
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300">Fecha Contratacion</label>
                            <Field
                                type="Date"
                                name="hiringDate"
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                            />
                            <ErrorMessage name="hiringDate" component="div" className="text-red-500 text-sm mt-1" />
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

export default EmpleadoForm;
