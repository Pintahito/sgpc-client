import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;
console.log(apiUrl);

const InventarioForm = ({ articulo, setArticulo, onSave, articuloEditado, closeModal }) => {
    const [proveedores, setProveedores] = useState([]);

    useEffect(() => {
        // Si hay un artículo editado, establecemos sus valores
        if (articuloEditado) {
            setArticulo(articuloEditado);
            console.log('Datos:', articuloEditado);
        }

        // Obtener proveedores de la API
        const fetchProveedores = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/v1/suppliers`);
                setProveedores(response.data);
                console.log('Proveedores obtenidos:', response.data);
            } catch (error) {
                console.error("Error al obtener proveedores:", error);
            }
        };

        fetchProveedores();
    }, [articuloEditado, setArticulo]);

    const initialValues = {
        name: articulo.name || '',
        amount: articulo.amount || '',
        unit: articulo.unit || '', // Nueva unidad de medida
        description: articulo.description || '',
        price: articulo.price || '',
        inputType: articulo.inputType || '',
        wineryName: articulo.wineryName || '',
        supplierId: articulo.supplierId || '',
        supplierNames: articulo.supplierNames || ''  // Añadir supplierName para la edición
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
        description: Yup.string().required('La Descripcion es obligatoria'),
        unit: Yup.string().required('La unidad de medida es obligatoria'), // Validación para la unidad
        price: Yup.number()
            .required('El precio es obligatorio')
            .positive('El precio debe ser positivo'),
        inputType: Yup.string().required('El insumo debe ser obligatorio'),
        supplierId: Yup.string().required('El proveedor es obligatorio'),
    });

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize={true}  // Permitir la reinicialización cuando el artículo editado cambie
        >
            {({isSubmitting, setFieldValue }) => (
                <Form>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300">Nombre</label>
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
                            <label className="block text-gray-700 dark:text-gray-300">Unidad de Medida</label>
                            <Field
                                as="select"
                                name="unit"
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                            >
                                <option value="" label="Seleccione una unidad" />
                                <option value="PZA" label="Piezas" />
                                <option value="KG" label="Kilogramos" />
                                <option value="TN" label="Toneladas" />
                                <option value="M" label="Metros" />
                                <option value="P" label="Pulgadas" />
                                <option value="CM" label="Centimetros" />
                                <option value="G" label="Gramos" />
                            </Field>
                            <ErrorMessage name="unit" component="div" className="text-red-500 text-sm mt-1" />
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
                                minLength={0}
                                maxLength={255}
                                type="text"
                                name="description"
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                            />
                            <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div>
                            <label className="block text-gray-700 dark:text-gray-300">Recu Proveedor</label>
                            <Field
                                type="text"
                                name="supplierNames"
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                                disabled
                            />

                            <ErrorMessage name="supplierNames" component="div" className="text-red-500 text-sm mt-1" />
                        </div>


                        <div>
                            <label className="block text-gray-700 dark:text-gray-300">Bodega</label>
                            <Field
                                as="select"
                                name="wineryName"
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                            >
                                <option value="" label="Seleccione una bodega" />
                                <option value="BODEGA_1" label="Bodega 1" />
                                <option value="BODEGA_2" label="Bodega 2" />
                                <option value="BODEGA_3" label="Bodega 3" />
                                <option value="BODEGA_4" label="Bodega 4" />
                                <option value="BODEGA_5" label="Bodega 5" />
                            </Field>
                            <ErrorMessage name="wineryName" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div>
                            <label className="block text-gray-700 dark:text-gray-300">Proveedor</label>
                            <Field
                                as="select"
                                name="supplierId"
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                            >
                                <option value="" label="Seleccione un proveedor" />
                                {proveedores.map((proveedor) => (
                                    <option key={proveedor.id_supplier} value={proveedor.id_supplier}>
                                        {proveedor.name}
                                    </option>
                                ))}
                            </Field>
                            <ErrorMessage
                                name="supplierId"
                                component="div"
                                className="text-red-500 text-sm mt-1"
                            />
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
