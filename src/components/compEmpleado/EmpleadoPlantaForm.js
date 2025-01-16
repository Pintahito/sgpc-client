import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;
console.log(apiUrl);

const EmpleadoPlantaForm = ({ empleadoPlanta, setEmpleadoPlanta, onSave, empleadoEditadoPlanta, closeModal }) => {

    const [banks, setBanco] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [puestos, setPuestos] = useState([]);
    const [departamentos, setDepartamento] = useState([]);

    useEffect(() => {
        if (empleadoEditadoPlanta) {
            setEmpleadoPlanta(empleadoEditadoPlanta);
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

        const fetchDepartamentos = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/v1/departments`);
                setDepartamento(response.data);
            } catch (error) {
                console.error('Error al obtener el departamento:', error);
            }
        };
        fetchDepartamentos();

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
    }, [empleadoEditadoPlanta, setEmpleadoPlanta]);

    const initialValues = {
        name: empleadoPlanta.name || '',
        rfc: empleadoPlanta.rfc || '',
        email: empleadoPlanta.email || '',
        hiringDate: empleadoPlanta.hiringDate || '',
        positionId: empleadoPlanta.positionId || '',
        categoryId: empleadoPlanta.categoryId || '',
        //Enviar el valor de tipo de empleado
        employeeType: empleadoPlanta.employeeType,
        accounts: empleadoPlanta.accounts || [{ bankId: '', accountNumber: '' }],
        phones: empleadoPlanta.phones || [{ phone: '', employeeId: '' }],
        //Datos para empleado PLANTA
        departmentId: empleadoPlanta.departmentId || '',
        workingHours: empleadoPlanta.workingHours || '',
        salary: empleadoPlanta.salary || '',
    };

    const handleSubmit = async (values, { setSubmitting }) => {

        try {
            await onSave(values);
            console.log("Datos enviados:");
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
        departmentId: Yup.string().required('El departamento es obligatorio'),
        workingHours: Yup.number().required('Las horas de trabajo son obligatorias'),
        salary: Yup.number().required('El salario es obligatorio')
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
                            <label className="block text-gray-700 dark:text-gray-300">Nombre</label>
                            <Field
                                minLength={0}
                                maxLength={100}
                                type="text" 
                                name="name" 
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                                />
                            <ErrorMessage name="name" component="div" className="text-red-500" />
                        </div>
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300">RFC</label>
                            <Field
                                minLength={13}
                                maxLength={13}
                                type="text" 
                                name="rfc" 
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                                />
                            <ErrorMessage name="rfc" component="div" className="text-red-500" />
                        </div>
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300">Email</label>
                            <Field
                                minLength={0}
                                maxLength={100}
                                type="email" 
                                name="email" 
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                                />
                            <ErrorMessage name="email" component="div" className="text-red-500" />
                        </div>
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300">Teléfono</label>
                            <Field
                                minLength={10}
                                maxLength={10}
                                type="text" 
                                name="phones[0].phone" 
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                                />
                            <ErrorMessage name="phones[0].phone" component="div" className="text-red-500" />
                        </div>
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300">Fecha</label>
                            <Field
                                type="date" 
                                name="hiringDate" 
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                                />
                            <ErrorMessage name="hiringdate" component="div" className="text-red-500" />
                        </div>
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300">Puesto</label>
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
                            <label className="block text-gray-700 dark:text-gray-300">Categoría</label>
                            <Field as="select" name="categoryId" className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md">
                                <option value="">Selecciona una categoria</option>
                                {categorias.map((cat) => (
                                    <option key={cat.idCategory} value={cat.idCategory}>
                                        {cat.name}
                                    </option>
                                ))}
                            </Field>
                            <ErrorMessage name="categoryId" component="div" className="text-red-500" />
                        </div>
                        {values.accounts.map((_account, index) => (
                            <div key={index} >
                                <label className="block text-gray-700 dark:text-gray-300">Banco</label>
                                <Field as="select" name={`accounts[${index}].bankId`} className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md">
                                    <option value="">Selecciona un banco</option>
                                    {banks.map((bank) => (
                                        <option key={bank.idBank} value={bank.idBank}>
                                            {bank.name}
                                        </option>
                                    ))}
                                </Field>
                                <ErrorMessage name={`accounts[${index}].bankId`} component="div" className="mt-1 text-red-500 text-sm" />

                                <label className="block text-gray-700 dark:text-gray-300">Número de cuenta</label>
                                <Field type="text"
                                    name={`accounts[${index}].accountNumber`}
                                    className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                                    />
                                <ErrorMessage name={`accounts[${index}].accountNumber`} component="div" text-red-500 />
                            </div>
                        ))}

                        <>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300">Departamento</label>
                                <Field as="select" name="departmentId" className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md">
                                    <option value="">Selecciona una categoria</option>
                                    {departamentos.map((deparment) => (
                                        <option key={deparment.idDepartment} value={deparment.idDepartment}>
                                            {deparment.name}
                                        </option>
                                    ))}
                                </Field>
                                <ErrorMessage name="departmentId" component="div" className="text-red-500" />
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300">Horas de trabajo</label>
                                <Field type="number" name="workingHours" 
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                                />
                                <ErrorMessage name="workingHours" component="div" className="text-red-500" />
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300">Salario</label>
                                <Field type="number" 
                                name="salary" 
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                                />
                                <ErrorMessage name="salary" component="div" className="text-red-500" />
                            </div>
                        </>
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

export default EmpleadoPlantaForm;
