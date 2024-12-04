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
        name: vehiculo.name || '',
        brand: vehiculo.brand || '',
        model: vehiculo.model || '',
        plates: vehiculo.plates || '',
        color: vehiculo.color || '',
        serial: vehiculo.serial || '',
        status: vehiculo.status || '',
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('El nombre es obligatorio'),
        brand: Yup.string().required('La marca es obligatoria'),
        model: Yup.string().required('El modelo es obligatorio'),
        plates: Yup.string().required('Las placas son obligatorias'),
        color: Yup.string().required('El color es obligatorio'),
        serial: Yup.string().required('El número de serie es obligatorio'),
        status: Yup.string().required('El estado es obligatorio'),
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
                            <label className="block text-gray-700 dark:text-gray-300">Nombre</label>
                            <Field type="text" name="name" className="input-field" />
                            <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                        </div>
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300">Marca</label>
                            <Field type="text" name="brand" className="input-field" />
                            <ErrorMessage name="brand" component="div" className="text-red-500 text-sm mt-1" />
                        </div>
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300">Modelo</label>
                            <Field type="text" name="model" className="input-field" />
                            <ErrorMessage name="model" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div>
                            <label className="block text-gray-700 dark:text-gray-300">Placas</label>
                            <Field type="text" name="plates" className="input-field" />
                            <ErrorMessage name="plates" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div>
                            <label className="block text-gray-700 dark:text-gray-300">Color</label>
                            <Field type="text" name="color" className="input-field" />
                            <ErrorMessage name="color" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div>
                            <label className="block text-gray-700 dark:text-gray-300">Serial</label>
                            <Field 
                            minLength={17}
                            maxLength={17}
                            type="text" name="serial" className="input-field" />
                            <ErrorMessage name="serial" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div>
                            <label className="block text-gray-700 dark:text-gray-300">Estado</label>
                            <Field as="select" name="status" className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md">
                                <option value="" label="Seleccione el estado" />
                                <option value="DISPONIBLE" label="Disponible" />
                                <option value="MANTENIMIENTO" label="Mantenimiento" />
                                <option value="FUERA_DE_SERVICIO" label="Fuera De Servicio" />
                            </Field>
                            <ErrorMessage name="status" component="div" className="text-red-500 text-sm mt-1" />
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
