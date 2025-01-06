import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;
console.log(apiUrl);

const EmpleadoForm = ({ empleadoObra, setEmpleadoObra, onSave, empleadoEditadoObra, closeModal }) => {

    const [banks, setBanco] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [puestos, setPuestos] = useState([]);

    useEffect(() => {
        if (empleadoEditadoObra) {
            setEmpleadoObra(empleadoEditadoObra);
        }
        // Obtener proveedores de la API
        const fetchBanco = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/v1/banks`);
                setBanco(response.data);
                console.log('Bancos obtenidos:', response.data);
            } catch (error) {
                console.error("Error al obtener Bancos:", error);
            }
        };
        fetchBanco();

        const fetchCategorias = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/v1/categories`);
                setCategorias(response.data);
            } catch (error) {
                console.error('Error al obtener la categoria:', error);
            }
        };
        fetchCategorias();


        // Obtener todos los puestos
        const fetchPuestos = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/v1/positions`);
                setPuestos(response.data);
            } catch (error) {
                console.error('Error al obtener los puestos:', error);
            }
        };
        fetchPuestos();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [empleadoEditadoObra, setEmpleadoObra]);

    const initialValues = {
        name: empleadoObra.name || '',
        rfc: empleadoObra.rfc || '',
        email: empleadoObra.email || '',
        hiringDate: empleadoObra.hiringDate || '',
        positionId: empleadoObra.positionId || '',
        categoryId: empleadoObra.categoryId || '',
        //Enviar el valor de tipo de empleado
        employeeType: empleadoObra.employeeType,
        accounts: empleadoObra.accounts || [{ bankId: '', accountNumber: '' }],
        phones: empleadoObra.phones || [{ phone: '', employeeId: '' }],
        //empleado de obra
        startDate: empleadoObra.startDate || '',
        endDate: empleadoObra.endDate || ''
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        let payload;
        try {
            await onSave(values);
            console.log("Datos enviados:", payload);
        } catch (error) {
            console.error("Error al guardar los datos:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('El nombre es obligatorio'),
        rfc: Yup.string()
            .required('El RFC es obligatorio')
            .matches(/^([A-ZÑ&]{3,4}) ?(?:-?(\d{2})(\d{2})(\d{2})) ?((?:[A-Z\d]{3}))$/, 'El RFC no es válido'),
        email: Yup.string()
            .email('El formato del correo no es válido')
            .required('El email es obligatorio'),
        hiringDate: Yup.string().required('La fecha es obligatoria'),
        positionId: Yup.string().required('Selecciona un puesto'),
        categoryId: Yup.string().required('Selecciona una categoría'),
        accounts: Yup.array().of(
            Yup.object().shape({
                bankId: Yup.number().required('Selecciona un banco'),
                accountNumber: Yup.string().required('Número de cuenta requerido')
            })
        ),
        phones: Yup.array().of(
            Yup.object().shape({
                phone: Yup.string().required('El teléfono es obligatorio'),
                employeeId: Yup.number()
            })
        ),
        startDate: Yup.string().required('La fecha es obligatoria'),
        endDate: Yup.string().required('La fecha es obligatoria')
    })

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize={false}
        >
            {({ values, isSubmitting }) => (
                <Form>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Datos generales */}
                        <div>
                            <label>Nombre</label>
                            <Field
                                minLength={0}
                                maxLength={100}
                                type="text" name="name" className="input" />
                            <ErrorMessage name="name" component="div" className="text-red-500" />
                        </div>
                        <div>
                            <label>RFC</label>
                            <Field
                                minLength={13}
                                maxLength={13}
                                type="text" name="rfc" className="input" />
                            <ErrorMessage name="rfc" component="div" className="text-red-500" />
                        </div>
                        <div>
                            <label>Email</label>
                            <Field
                                minLength={0}
                                maxLength={100}
                                type="email" name="email" className="input" />
                            <ErrorMessage name="email" component="div" className="text-red-500" />
                        </div>
                        <div>
                            <label>Teléfono</label>
                            <Field
                                minLength={10}
                                maxLength={10}
                                type="text" name="phones[0].phone" className="input" />
                            <ErrorMessage name="phones[0].phone" component="div" className="text-red-500" />
                        </div>
                        <div>
                            <label>Fecha</label>
                            <Field
                                type="date" name="hiringDate" className="input" />
                            <ErrorMessage name="hiringdate" component="div" className="text-red-500" />
                        </div>
                        <div>
                            <label>Puesto</label>
                            <Field as="select" name="positionId" className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md">
                                <option value="">Selecciona un puesto</option>
                                {puestos.map((puesto) => (
                                    <option key={puesto.idPosition} value={puesto.idPosition}>
                                        {puesto.name}
                                    </option>
                                ))}
                            </Field>
                            <ErrorMessage name="positionId" component="div" className="text-red-500" />
                        </div>

                        <div>
                            <label className="block text-gray-700 dark:text-gray-300">
                                Categoría
                            </label>
                            <Field
                                as="select"
                                name="categoryId"
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                            >
                                <option value="">Selecciona una categoría</option>
                                {categorias.map((cat) => (
                                    <option key={cat.idCategory} value={cat.idCategory}>
                                        {cat.name}
                                    </option>
                                ))}
                            </Field>
                            <ErrorMessage
                                name="categoryId"
                                component="div"
                                className="text-red-500 mt-1"
                            />
                        </div>

                        {values.accounts.map((_account, index) => (
                            <div key={index} >
                                <label>Banco</label>
                                <Field as="select" name={`accounts[${index}].bankId`} className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md">
                                    <option value="">Selecciona un banco</option>
                                    {banks.map((bank) => (
                                        <option key={bank.idBank} value={bank.idBank}>
                                            {bank.name}
                                        </option>
                                    ))}
                                </Field>
                                <ErrorMessage name={`accounts[${index}].bankId`} component="div" className="mt-1 text-red-500 text-sm" />

                                <label>Número de cuenta</label>
                                <Field type="text"
                                    name={`accounts[${index}].accountNumber`}
                                    className="input" />
                                <ErrorMessage name={`accounts[${index}].accountNumber`} component="div" text-red-500 />
                            </div>
                        ))}
                            <div>
                                <label>Fecha Inicio</label>
                                <Field
                                    type="date" name="startDate" className="input" />
                                <ErrorMessage name="startDate" component="div" className="text-red-500" />
                            </div>
                            <div>
                                <label>Fecha Finalizacion</label>
                                <Field
                                    type="date" name="endDate" className="input" />
                                <ErrorMessage name="endDate" component="div" className="text-red-500" />
                            </div> 
                    </div>

                    <div className="mt-6 flex justify-end gap-4">
                        <button
                            type="button"
                            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                            onClick={closeModal}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default EmpleadoForm;
