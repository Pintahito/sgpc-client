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
        name: maquinaria.name || '',
        brand: maquinaria.brand || '',
        model: maquinaria.model || '',
        serial: maquinaria.serial || '',
        acquisitionDate: maquinaria.acquisitionDate || '',
        status: maquinaria.status || '',
        toolType: maquinaria.toolType || '',
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
        name: Yup.string().required('El nombre es obligatorio'),
        brand: Yup.string().required('La marca es obligatoria'),
        model: Yup.string().required('El modelo es obligatorio'),
        serial: Yup.string().required('El número de serie es obligatorio'),
        acquisitionDate: Yup.date().required('La fecha de adquisición es obligatoria'),
        status: Yup.string().required('El estado es obligatorio'),
        toolType: Yup.string().required('El tipo es obligatorio'),
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
                            <label className="block text-gray-700 dark:text-gray-300">Nombre De Maquinaria</label>
                            <Field 
                            minLength={0}
                            maxLength={100}
                            type="text" 
                            name="name" 
                            className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                            />
                            <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                        </div>
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300">Marca</label>
                            <Field 
                            minLength={0}
                            maxLength={50}
                            type="text" 
                            name="brand" 
                            className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" 
                            />
                            <ErrorMessage name="brand" component="div" className="text-red-500 text-sm mt-1" />
                        </div>
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300">Modelo</label>
                            <Field 
                            minLength={4}
                            maxLength={4}
                            type="text" 
                            name="model" 
                            className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                            />
                            <ErrorMessage name="model" component="div" className="text-red-500 text-sm mt-1" />
                        </div>
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300">Serial</label>
                            <Field 
                            minLength={17}
                            maxLength={17}
                            type="text" 
                            name="serial" 
                            className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                            />

                            <ErrorMessage name="serial" component="div" className="text-red-500 text-sm mt-1" />
                        </div>
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300">Fecha de Adquisición</label>
                            <Field type="date" 
                            name="acquisitionDate" 
                            className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                            />
                            <ErrorMessage name="acquisitionDate" component="div" className="text-red-500 text-sm mt-1" />
                        </div>
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300">Tipo Herramienta</label>
                            <Field as="select" name="toolType" className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" >
                                <option value="" label="Seleccione el tipo" />
                                <option value="MAQUINARIA" label="Maquinaria" />
                                <option value="EQUIPO" label="Equipo" />
                            </Field>
                            <ErrorMessage name="toolType" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div>
                            <label className="block text-gray-700 dark:text-gray-300">Estado</label>
                            <Field as="select" name="status" className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" >
                                <option value="" label="Seleccione el estado" />
                                <option value="DISPONIBLE" label="Disponible" />
                                <option value="RENTA" label="Renta" />
                                <option value="MANTENIMIENTO" label="Mantenimiento" />
                                <option value="FUERA_DE_SERVICIO" label="Fuera de Servicio" />
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

export default MaquinariaForm;
