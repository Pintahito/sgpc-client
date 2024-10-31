import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const MaquinariaForm = ({ maquinaria, setMaquinaria, onSave, maquinariaEditada, closeModal }) => {
    useEffect(() => {
        if (maquinariaEditada) {
            setMaquinaria(maquinariaEditada);
        }
    }, [maquinariaEditada, setMaquinaria]);

    const initialValues = {
        nombre: maquinaria.nombre || '',
        marca: maquinaria.marca || '',
        modelo: maquinaria.modelo || '',
        serial: maquinaria.serial || '',
        fechaAdquisicion: maquinaria.fechaAdquisicion || '',
        costo: maquinaria.costo || '',
        estado: maquinaria.estado || '',
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            await onSave(values); // Llama a la función para guardar
            closeModal(); // Cierra el modal después de guardar
        } catch (error) {
            console.error("Error al guardar los datos:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const validationSchema = Yup.object().shape({
        nombre: Yup.string().required('El nombre es obligatorio'),
        marca: Yup.string().required('La marca es obligatoria'),
        modelo: Yup.string().required('El modelo es obligatorio'),
        serial: Yup.string().required('El número de serie es obligatorio'),
        fechaAdquisicion: Yup.date().required('La fecha de adquisición es obligatoria'),
        costo: Yup.number().positive('El costo debe ser positivo').required('El costo es obligatorio'),
        estado: Yup.string().required('El estado es obligatorio'),
    });



    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize={false} // Permite reinicializar el formulario si cambian los valores iniciales
        >
            {({ isSubmitting }) => (
                <Form>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300">Nombre</label>
                            <Field type="text" name="nombre" className="input-field" />
                            <ErrorMessage name="nombre" component="div" className="text-red-500 text-sm mt-1" />
                        </div>
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
                            <label className="block text-gray-700 dark:text-gray-300">Serial</label>
                            <Field type="text" name="serial" className="input-field" />
                            <ErrorMessage name="serial" component="div" className="text-red-500 text-sm mt-1" />
                        </div>
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300">Fecha de Adquisición</label>
                            <Field type="date" name="fechaAdquisicion" className="input-field" />
                            <ErrorMessage name="fechaAdquisicion" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div>
                            <label className="block text-gray-700 dark:text-gray-300">Costo</label>
                            <Field type="number" name="costo" step="0.01" className="input-field" />
                            <ErrorMessage name="costo" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div>
                            <label className="block text-gray-700 dark:text-gray-300">Estado</label>
                            <Field as="select" name="estado" className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" >
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

export default MaquinariaForm;
