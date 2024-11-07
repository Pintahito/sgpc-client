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
                const response = await axios.get('http://10.73.1.34:8081/api/v1/suppliers'); // Cambia a la URL correcta de tu API
                setProveedores(response.data);
            } catch (error) {
                console.error("Error al obtener proveedores:", error);
            }
        };

        fetchProveedores();
    }, [articuloEditado, setArticulo]);

    const initialValues = {
        name: articulo.name || '',
        quantity: articulo.quantity || '',
        price: articulo.price || '',
        description: articulo.description || '',
        proveedor: articulo.proveedor || '',
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
                        {/* Otros campos */}

                        <div>
                            <label className="block text-gray-700 dark:text-gray-300">Proveedor</label>
                            <Field
                                as="select"
                                name="proveedor"
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                            >
                                <option value="" label="Seleccione un proveedor" />
                                {proveedores.map((proveedor) => (
                                    <option key={proveedor.id_supplier} value={proveedor.id_supplier}>
                                        {proveedor.name}
                                    </option>
                                ))}
                            </Field>
                            <ErrorMessage name="proveedor" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        {/* Otros campos */}
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
