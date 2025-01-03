import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const EtapaForm = ({ etapa, setEtapa, onSave, etapaEditada, closeModal }) => {
    useEffect(() => {
        if (etapaEditada) {
            setEtapa(etapaEditada);
        }
    }, [etapaEditada, setEtapa]);

    const initialValues = {
        name: etapa.name || '',
        description: etapa.description || '',
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
        description: Yup.string().required('La descripcion es obligatoria'),
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
                                minLength={0}
                                maxLength={80}
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                            />
                            <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        {/* Descripcion */}
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300">Descripcion</label>
                            <Field
                                as="textarea"
                                name="description"
                                minLength={0}
                                maxLength={255}
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                            />
                            <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
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

export default EtapaForm;