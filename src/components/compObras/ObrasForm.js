import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const ObrasForm = ({ obra, setObra, onSave, obraEditada, closeModal, tipoObra }) => {
    useEffect(() => {
        if (obraEditada) {
            setObra(obraEditada);
        }
    }, [obraEditada, setObra]);

    const initialValues = {
        name: obra.name || '',
        description: obra.description || '',
        estimatedStartDate: obra.estimatedStartDate || '',
        estimatedEndDate: obra.estimatedEndDate || '',
        actualStartDate: obra.actualStartDate || '',
        actualEndDate: obra.actualEndDate || '',
        allocatedBudget: obra.allocatedBudget || '',
        actualCost: obra.actualCost || '',
        address: obra.address || '',
        workTypeId: obra.workTypeId || 0,
        longitude: obra.longitude || '',
        latitude: obra.latitude || ''
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        let payload;
        try {
            await onSave(values, payload);
        } catch (error) {
            console.error("Error al guardar los datos:", error);
            console.log("Datos:", payload)
        } finally {
            setSubmitting(false);
        }
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('El nombre es obligatorio'),
        description: Yup.string().required('La descripción es obligatoria'),
        estimatedStartDate: Yup.date().required('La fecha estimada de inicio es obligatoria'),
        estimatedEndDate: Yup.date().required('La fecha estimada de finalización es obligatoria'),
        actualStartDate: Yup.date().nullable(),
        actualEndDate: Yup.date().nullable(),
        allocatedBudget: Yup.number().required('El presupuesto asignado es obligatorio').min(0, 'Debe ser mayor o igual a 0'),
        actualCost: Yup.number().min(0, 'Debe ser mayor o igual a 0'),
        address: Yup.string().required('La dirección es obligatoria'),
        workTypeId: Yup.string().required('El tipo de obra es obligatorio'),
        longitude: Yup.number().required('La longitud es obligatoria').min(-180).max(180),
        latitude: Yup.number().required('La latitud es obligatoria').min(-90).max(90)
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
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300">Nombre De La Obra</label>
                            <Field type="text"
                                name="name"
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" />
                            <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                        </div>
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300">Longitud</label>
                            <Field type="number"
                                name="longitude"
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" />
                            <ErrorMessage name="longitude" component="div" className="text-red-500 text-sm mt-1" />
                        </div>
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300">Dirección</label>
                            <Field as="textarea"
                                name="address"
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" />
                            <ErrorMessage name="address" component="div" className="text-red-500 text-sm mt-1" />
                        </div>
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300">Latitud</label>
                            <Field type="number"
                                name="latitude"
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" />
                            <ErrorMessage name="latitude" component="div" className="text-red-500 text-sm mt-1" />
                        </div>
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300">Fecha estimada de inicio</label>
                            <Field type="date" name="estimatedStartDate" className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" />
                            <ErrorMessage name="estimatedStartDate" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div>
                            <label className="block text-gray-700 dark:text-gray-300">Fecha estimada de finalización</label>
                            <Field type="date"
                                name="estimatedEndDate"
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" />
                            <ErrorMessage name="estimatedEndDate" component="div" className="text-red-500 text-sm mt-1" />
                        </div>
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300">Fecha de inicio Real</label>
                            <Field type="date" name="actualStartDate" className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" />
                            <ErrorMessage name="actualStartDate" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div>
                            <label className="block text-gray-700 dark:text-gray-300">Fecha de finalización Real</label>
                            <Field type="date"
                                name="actualEndDate"
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" />
                            <ErrorMessage name="actualEndDate" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div>
                            <label className="block text-gray-700 dark:text-gray-300">Presupuesto asignado</label>
                            <Field type="number"
                                name="allocatedBudget"
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" />
                            <ErrorMessage name="allocatedBudget" component="div" className="text-red-500 text-sm mt-1" />
                        </div>
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300">Costo Real</label>
                            <Field type="number"
                                name="actualCost"
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" />
                            <ErrorMessage name="actualCost" component="div" className="text-red-500 text-sm mt-1" />
                        </div>
                        {/* Tipo de Obra */}
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300">Tipos De Obra</label>
                            <Field
                                as="select"
                                name="workTypeId"
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                            >
                                <option value="">Selecciona un tipo de obra</option>
                                {tipoObra.map(tipoObra => (
                                    <option key={tipoObra.idWorkType} value={tipoObra.idWorkType}>
                                        {tipoObra.name}
                                    </option>
                                ))}
                            </Field>
                            <ErrorMessage name="workTypeId" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div>
                            <label className="block text-gray-700 dark:text-gray-300">Descripción</label>
                            <Field as="textarea"
                                name="description"
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" />
                            <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-4">
                        <button type="button" className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition"
                            onClick={closeModal}>Cancelar</button>
                        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
                            disabled={isSubmitting}>{isSubmitting ? 'Guardando...' : 'Guardar'}</button>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default ObrasForm;
