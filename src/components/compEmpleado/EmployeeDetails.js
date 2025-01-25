import React from "react";
import {
  FaCalendarAlt,
  FaPhone,
  FaUserTie,
  FaEnvelope,
  FaMoneyCheckAlt,
  FaIdBadge,
  FaArrowLeft,
} from "react-icons/fa";

const EmployeeDetails = ({ employee, onBack }) => {
  if (!employee) {
    return (
      <div className="p-6 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Detalles del Empleado</h1>
        <p className="text-lg">No se encontró el empleado seleccionado.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white min-h-screen">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6 text-center border-b pb-4 text-gray-800 dark:text-white">
          Detalles del Empleado
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Imagen y Nombre del Empleado */}
          <div className="flex flex-col items-center">
            <img
              src="https://static.vecteezy.com/system/resources/previews/026/322/714/non_2x/people-silhouette-icon-employee-or-member-icon-vector.jpg"
              alt="Empleado"
              className="w-32 h-32 rounded-full mb-4 border"
            />
            <p className="text-2xl font-semibold">{employee.name}</p>
          </div>

          {/* Información del Empleado */}
          <div>
            <p className="text-lg font-semibold flex items-center">
              <FaIdBadge className="mr-2 text-blue-500" /> RFC:
            </p>
            <p className="mb-4 text-gray-700 dark:text-gray-300">{employee.rfc}</p>

            <p className="text-lg font-semibold flex items-center">
              <FaEnvelope className="mr-2 text-blue-500" /> Correo Electrónico:
            </p>
            <p className="mb-4 text-gray-700 dark:text-gray-300">{employee.email}</p>

            <p className="text-lg font-semibold flex items-center">
              <FaCalendarAlt className="mr-2 text-green-500" /> Fecha de Contratación:
            </p>
            <p className="mb-4 text-gray-700 dark:text-gray-300">{employee.hiringDate}</p>
          </div>

          {/* Tipo y Posición */}
          <div>
            <p className="text-lg font-semibold flex items-center">
              <FaUserTie className="mr-2 text-purple-500" /> Tipo de Empleado:
            </p>
            <p className="mb-4 text-gray-700 dark:text-gray-300">{employee.employeeType}</p>

            <p className="text-lg font-semibold flex items-center">
              <FaUserTie className="mr-2 text-purple-500" /> Puesto:
            </p>
            <p className="mb-4 text-gray-700 dark:text-gray-300">{employee.positionName}</p>

            <p className="text-lg font-semibold flex items-center">
              <FaUserTie className="mr-2 text-purple-500" /> Categoría:
            </p>
            <p className="mb-4 text-gray-700 dark:text-gray-300">{employee.categoryName}</p>
          </div>

          {/* Información específica por tipo de empleado */}
          {employee.employeeType === "OBRA" && (
            <div>
              <p className="text-lg font-semibold flex items-center">
                <FaCalendarAlt className="mr-2 text-green-500" /> Fecha de Inicio:
              </p>
              <p className="mb-4 text-gray-700 dark:text-gray-300">{employee.startDate}</p>

              <p className="text-lg font-semibold flex items-center">
                <FaCalendarAlt className="mr-2 text-red-500" /> Fecha de Finalización:
              </p>
              <p className="mb-4 text-gray-700 dark:text-gray-300">{employee.endDate}</p>
            </div>
          )}

          {employee.employeeType === "PLANTA" && (
            <div>
              <p className="text-lg font-semibold flex items-center">
                <FaCalendarAlt className="mr-2 text-green-500" /> Horas de Trabajo:
              </p>
              <p className="mb-4 text-gray-700 dark:text-gray-300">{employee.workingHours}</p>

              <p className="text-lg font-semibold flex items-center">
                <FaMoneyCheckAlt className="mr-2 text-yellow-500" /> Salario:
              </p>
              <p className="mb-4 text-gray-700 dark:text-gray-300">{employee.salary}</p>

              <p className="text-lg font-semibold flex items-center">
                <FaUserTie className="mr-2 text-purple-500" /> Departamento:
              </p>
              <p className="mb-4 text-gray-700 dark:text-gray-300">{employee.departmentName}</p>
            </div>
          )}

          {/* Cuentas Bancarias */}
          <div>
            <p className="text-lg font-semibold flex items-center">
              <FaMoneyCheckAlt className="mr-2 text-yellow-500" /> Cuentas Bancarias:
            </p>
            {employee.accounts.map((account, index) => (
              <div key={index} className="mb-4">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Banco:</strong> {account.nameBank}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Número de Cuenta:</strong> {account.accountNumber}
                </p>
              </div>
            ))}
          </div>

          {/* Teléfonos */}
          <div>
            <p className="text-lg font-semibold flex items-center">
              <FaPhone className="mr-2 text-green-500" /> Teléfonos:
            </p>
            {employee.phones.map((phone, index) => (
              <p key={index} className="mb-4 text-gray-700 dark:text-gray-300">
                {phone.phone}
              </p>
            ))}
          </div>
        </div>

        {/* Botón Volver */}
        <div className="mt-6 flex justify-center">
          <button
            className="bg-gray-500 text-white py-2 px-6 rounded-md hover:bg-gray-600 transition flex items-center gap-2"
            onClick={onBack}
          >
            <FaArrowLeft /> Volver al listado
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
