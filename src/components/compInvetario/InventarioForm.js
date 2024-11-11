import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const InventarioForm = ({ articulo, setArticulo, onSave, articuloEditado, closeModal }) => {
    const [proveedores, setProveedores] = useState([]);

    useEffect(() => {
        // Si hay un artículo editado, establecemos sus valores
        if (articuloEditado) {
            setArticulo(articuloEditado);
        }

        // Obtener proveedores de la API
        const fetchProveedores = async () => {
            try {
                const response = await axios.get('http://10.73.1.36:8081/api/v1/suppliers'); // Cambia a la URL correcta de tu API
                setProveedores(response.data);
            } catch (error) {
                console.error("Error al obtener proveedores:", error);
            }
        };

        fetchProveedores();
    }, [articuloEditado, setArticulo]);

    const initialValues = {
        name: articulo.name || '',
        amount: articulo.amount || '',
        description: articulo.description || '',
        price: articulo.price || '',
        inputType: articulo.inputType || '',
        wineryName: articulo.wineryName || '',
        supplierId: articulo.supplierId || ''
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
        amount: Yup.number()
            .required('La cantidad es obligatoria')
            .positive('La cantidad debe ser positiva')
            .integer('La cantidad debe ser un número entero'),
        price: Yup.number()
            .required('El precio es obligatorio')
            .positive('El precio debe ser positivo'),
        description: Yup.string(),
        proveedor: Yup.string().required('El proveedor es obligatorio'),
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
                                name="wineryName"
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                            >
                                <option value="" label="Seleccione un proveedor" />
                                <option value="BODEGA_1" label="Bodega1" />
                                <option value="BODEGA_2" label="Bodega2" />
                                <option value="BODEGA_3" label="Bodega3" />
                                <option value="BODEGA_4" label="Bodega4" />
                                <option value="BODEGA_5" label="Bodega5" />
                            </Field>
                            <ErrorMessage name="wineryName" component="div" className="text-red-500 text-sm mt-1" />
                        </div>
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300">Cantidad</label>
                            <Field
                                type="number"
                                name="amount"
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                            />
                            <ErrorMessage name="amount" component="div" className="text-red-500 text-sm mt-1" />
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
                                name="supplierId"
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                            >
                                <option value="supplierId" label="Seleccione un proveedor" />
                                {proveedores.map((proveedor) => (
                                    <option key={proveedor.id_supplier} value={proveedor.id_supplier}>
                                        {proveedor.name}
                                    </option>
                                ))}
                            </Field>
                            <ErrorMessage name="supplierId" component="div" className="text-red-500 text-sm mt-1" />
                        </div>
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300">Tipo Insumo</label>
                            <Field
                                as="select"
                                name="inputType"
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                            >
                                <option value="" label="Seleccione un tipo de insumo" />
                                <option value="MATERIAL" label="Material" />
                                <option value="HERRAMIENTA_MAYOR" label="Herramienta Pesada" />
                                <option value="HERRAMIENTA_MENOR" label="Herramienta Ligera" />
                            </Field>
                            <ErrorMessage name="inputType" component="div" className="text-red-500 text-sm mt-1" />
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
