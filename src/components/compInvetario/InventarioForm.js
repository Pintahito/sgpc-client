import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const InventarioForm = ({ articulo, setArticulo, onSave, articuloEditado, closeModal }) => {
    useEffect(() => {
        if (articuloEditado) {
            setArticulo(articuloEditado);
        }
    }, [articuloEditado, setArticulo]);

    const initialValues = {
        name: articulo.name || '',
        quantity: articulo.quantity || '',
        price: articulo.price || '',
        description: articulo.description || '',
    };

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

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('El nombre es obligatorio'),
        quantity: Yup.number()
            .required('La cantidad es obligatoria')
            .positive('La cantidad debe ser positiva')
            .integer('La cantidad debe ser un número entero'),
        price: Yup.number()
            .required('El precio es obligatorio')
            .positive('El precio debe ser positivo'),
        description: Yup.string(),
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
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300">Nombre</label>
                            <Field
                                type="text"
                                name="name"
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                            />
                            <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div>
                            <label className="block text-gray-700 dark:text-gray-300">Bodega</label>
                            <Field
                                as="select"
                                name="bodega"
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                            >
                                <option value="" label="Seleccione un proveedor" />
                                <option value="Bodega1" label="Bodega1" />
                                <option value="Bodega2" label="Bodega2" />
                                <option value="Bodega3" label="Bodega3" />
                            </Field>
                            <ErrorMessage name="bodega" component="div" className="text-red-500 text-sm mt-1" />
                        </div>


                        <div>
                            <label className="block text-gray-700 dark:text-gray-300">Cantidad</label>
                            <Field
                                type="number"
                                name="quantity"
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                            />
                            <ErrorMessage name="quantity" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div>
                            <label className="block text-gray-700 dark:text-gray-300">Precio</label>
                            <Field
                                type="number"
                                name="price"
                                step="0.01"
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                            />
                            <ErrorMessage name="price" component="div" className="text-red-500 text-sm mt-1" />
                        </div>
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300">Descripción</label>
                            <Field
                                type="text"
                                name="description"
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                            />
                            <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
                        </div>
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300">Proveedor</label>
                            <Field
                                as="select"
                                name="proveedor"
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                            >
                                <option value="" label="Seleccione un proveedor" />
                                <option value="insumo1" label="Trupper" />
                                <option value="insumo2" label="Construccciones Pesadas" />
                                <option value="insumo3" label="Casa de materiales" />
                            </Field>
                            <ErrorMessage name="proveedor" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div>
                            <label className="block text-gray-700 dark:text-gray-300">Tipo Insumo</label>
                            <Field
                                as="select"
                                name="tipoInsumo"
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                            >
                                <option value="" label="Seleccione un tipo de insumo" />
                                <option value="insumo1" label="Material" />
                                <option value="insumo2" label="Herramienta Pesada" />
                                <option value="insumo3" label="Herramienta Ligera" />
                            </Field>
                            <ErrorMessage name="tipoInsumo" component="div" className="text-red-500 text-sm mt-1" />
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

export default InventarioForm;
