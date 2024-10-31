import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const VehiculoForm = ({ vehiculo, setVehiculo, onSave, vehiculoEditado, closeModal }) => {
    useEffect(() => {
        if (vehiculoEditado) {
            setVehiculo(vehiculoEditado);
        }
    }, [vehiculoEditado, setVehiculo]);

    const initialValues = {
        marca: vehiculo.marca || '',
        modelo: vehiculo.modelo || '',
        placas: vehiculo.placas || '',
        color: vehiculo.color || '',
        ano: vehiculo.ano || '',
        serial: vehiculo.serial || '',
        estado: vehiculo.estado || '',
    };

    const validationSchema = Yup.object().shape({
        marca: Yup.string().required('La marca es obligatoria'),
        modelo: Yup.string().required('El modelo es obligatorio'),
        placas: Yup.string().required('Las placas son obligatorias'),
        color: Yup.string().required('El color es obligatorio'),
        ano: Yup.number().required('El año es obligatorio').integer('Debe ser un número entero'),
        serial: Yup.string().required('El número de serie es obligatorio'),
        estado: Yup.string().required('El estado es obligatorio'),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            await onSave(values);
            closeModal();
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300">Marca</label>
                            <Field type="text" name="marca" className="input-field" />
                            <ErrorMessage name="marca" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div>
                            <label className="block text-gray-700 dark:text-gray-300">Modelo</label>
                            <Field type="text" name="modelo" className="input-field" />
                            <ErrorMessage name="modelo" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div>
                            <label className="block text-gray-700 dark:text-gray-300">Placas</label>
                            <Field type="text" name="placas" className="input-field" />
                            <ErrorMessage name="placas" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div>
                            <label className="block text-gray-700 dark:text-gray-300">Color</label>
                            <Field type="text" name="color" className="input-field" />
                            <ErrorMessage name="color" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div>
                            <label className="block text-gray-700 dark:text-gray-300">Año</label>
                            <Field type="number" name="ano" className="input-field" />
                            <ErrorMessage name="ano" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div>
                            <label className="block text-gray-700 dark:text-gray-300">Serial</label>
                            <Field type="text" name="serial" className="input-field" />
                            <ErrorMessage name="serial" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div>
                            <label className="block text-gray-700 dark:text-gray-300">Estado</label>
                            <Field as="select" name="estado" className="input-field">
                                <option value="" label="Seleccione el estado" />
                                <option value="operativo" label="Operativo" />
                                <option value="en reparación" label="En Reparación" />
                                <option value="fuera de servicio" label="Fuera de Servicio" />
                            </Field>
                            <ErrorMessage name="estado" component="div" className="text-red-500 text-sm mt-1" />
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

export default VehiculoForm;
