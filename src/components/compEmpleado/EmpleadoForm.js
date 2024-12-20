import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;
console.log(apiUrl);

const EmpleadoForm = ({ empleado, setEmpleado, onSave, empleadoEditado, closeModal }) => {
    const [employeeType, setEmployeeType] = useState('');
    const [banks, setBanco] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [puestos, setPuestos] = useState([]);
    const [departamentos, setDepartamentos] = useState([]);

    useEffect(() => {
        if (empleadoEditado) {
            setEmpleado(empleadoEditado);
            setEmployeeType(empleadoEditado.employeeType || '');
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

          // Obtener todos los departamentos
          const fetchDepartamentos = async () => {
            try {
              const response = await axios.get(`${apiUrl}/api/v1/departments`);
              setDepartamentos(response.data);
            } catch (error) {
              console.error('Error al obtener departamentos:', error);
            }
          };
          fetchDepartamentos();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [empleadoEditado, setEmpleado]);

    const initialValues = {
        name: empleado.name || '',
        rfc: empleado.rfc || '',
        email: empleado.email || '',
        hiringDate: empleado.hiringDate || '',
        accountNumber: empleado.accountNumber || '',
        positionId: empleado.position || '',
        categoryId: empleado.category || '',
        accounts: empleado.accounts || '',
        bankId: empleado.bankId || '',
        phone: empleado.phone || '',
        department: '',
        workHours: '',
        salary: '',
        startDate: '',
        endDate: ''
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
        rfc: Yup.string()
            .required('El RFC es obligatorio')
            .matches(/^([A-ZÑ&]{3,4}) ?(?:-?(\d{2})(\d{2})(\d{2})) ?((?:[A-Z\d]{3}))$/, 'El RFC no es válido'),
        email: Yup.string()
            .email('El formato del correo no es válido')
            .required('El email es obligatorio'),
        accountNumber: Yup.string().required('El número de cuenta es obligatorio'),
        phone: Yup.string().required('El teléfono es obligatorio'),
        id_bank: Yup.string().required('Selecciona un banco'),
        position: Yup.string().required('Selecciona un puesto'),
        category: Yup.string().required('Selecciona una categoría'),
        ...(employeeType === 'PLANTA' && {
            department: Yup.string().required('El departamento es obligatorio'),
            workHours: Yup.string().required('Las horas de trabajo son obligatorias'),
            salary: Yup.string().required('El salario es obligatorio')
        }),
        ...(employeeType === 'OBRA' && {
            startDate: Yup.string().required('La fecha de inicio es obligatoria'),
            endDate: Yup.string().required('La fecha de finalización es obligatoria')
        })
    });

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize={false}
        >
            {({ values, isSubmitting, setFieldValue }) => (
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
                            <label>Número de cuenta</label>
                            <Field
                                minLength={16}
                                maxLength={16}
                                type="text" name="accountNumber" className="input" />
                            <ErrorMessage name="accountNumber" component="div" className="text-red-500" />
                        </div>
                        <div>
                            <label>Teléfono</label>
                            <Field
                                minLength={10}
                                maxLength={10}
                                type="text" name="phone" className="input" />
                            <ErrorMessage name="phone" component="div" className="text-red-500" />
                        </div>
                        <div>
                            <label>Banco</label>
                            <Field as="select" name="bank" className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md">
                                <option value="">Selecciona un banco</option>
                                {banks.map((bank) => (
                                    <option key={bank.id_bank} value={bank.id_bank}>
                                        {bank.name}
                                    </option>
                                ))}
                            </Field>
                            <ErrorMessage name="bank" component="div" className="text-red-500" />
                        </div>
                        <div>
                            <label>Puesto</label>
                            <Field as="select" name="position" className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md">
                                <option value="">Selecciona un banco</option>
                                {puestos.map((puesto) => (
                                    <option key={puesto.id_position} value={puesto.id_position}>
                                        {puesto.name}
                                    </option>
                                ))}
                            </Field>
                            <ErrorMessage name="position" component="div" className="text-red-500" />
                        </div>
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300">Categoría</label>
                            <Field as="select" name="category" className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md">
                                <option value="">Selecciona un banco</option>
                                {categorias.map((cat) => (
                                    <option key={cat.id_categoria} value={cat.id_categoria}>
                                        {cat.name}
                                    </option>
                                ))}
                            </Field>
                            <ErrorMessage name="category" component="div" className="text-red-500" />
                        </div>

                        {/* Tipo de empleado */}
                        <div className="md:col-span-2">
                            <label className="mt-1 block w-full px-3 py-0 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md">
                                <Field
                                    type="checkbox"
                                    name="employeeType"
                                    value="PLANTA"
                                    checked={employeeType === 'PLANTA'}
                                    onChange={() => setEmployeeType('PLANTA')}
                                />
                                Planta
                            </label>
                            <label className="mt-1 block w-full px-3 py-0 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md">
                                <Field
                                    type="checkbox"
                                    name="employeeType"
                                    value="OBRA"
                                    checked={employeeType === 'OBRA'}
                                    onChange={() => setEmployeeType('OBRA')}
                                />
                                Obra
                            </label>
                        </div>

                        {/* Campos adicionales */}
                        {employeeType === 'PLANTA' && (
                            <>
                                <div>
                                    <label>Departamento</label>
                                    <Field as="select" name="department" className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md">
                                        <option value="">Selecciona un departamento</option>
                                        {departamentos.map((depa) => (
                                            <option key={depa.id_departament} value={depa.id_departament}>
                                                {depa.name}
                                            </option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="department" component="div" className="text-red-500" />
                                </div>
                                <div>
                                    <label>Horas de trabajo</label>
                                    <Field type="text" name="workHours" className="input" />
                                    <ErrorMessage name="workHours" component="div" className="text-red-500" />
                                </div>
                                <div>
                                    <label>Salario</label>
                                    <Field type="text" name="salary" className="input" />
                                    <ErrorMessage name="salary" component="div" className="text-red-500" />
                                </div>
                            </>
                        )}

                        {employeeType === 'OBRA' && (
                            <>
                                <div>
                                    <label>Fecha de inicio</label>
                                    <Field type="date" name="startDate" className="input" />
                                    <ErrorMessage name="startDate" component="div" className="text-red-500" />
                                </div>
                                <div>
                                    <label>Fecha de finalización</label>
                                    <Field type="date" name="endDate" className="input" />
                                    <ErrorMessage name="endDate" component="div" className="text-red-500" />
                                </div>
                            </>
                        )}
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
