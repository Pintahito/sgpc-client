import React, { useState } from "react";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaDollarSign,
  FaFileAlt,
  FaListUl,
  FaArrowLeft,
  FaPlus,
  FaEye,
  FaUserPlus,
  FaBarcode,
} from "react-icons/fa";
import ClientWorkList from "./ClientWorkList";
import Swal from "sweetalert2";
import axios from "axios";
import Modal from "./Modal";
import AssignClientForm from "./AssignClientForm";

const ObrasDetails = ({
  obra,
  onBack,
  onOpenScheduleModal,
  onViewSchedule,
  onOpenAssignSupplierModal,
  onOpenAssignClientModal,
  apiUrl,
}) => {
  const [reloadClientWorks, setReloadClientWorks] = useState(false);

  // Estado para asignar/editar cliente
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [editingClientWork, setEditingClientWork] = useState(null);

  const handleClientAdded = () => {
    setReloadClientWorks((prev) => !prev); // Cambia el estado para forzar la recarga
  };
  const handleEditClientWork = (clientWork) => {
    setEditingClientWork(clientWork); // Almacena el cliente que se está editando
    setIsClientModalOpen(true); // Abre el modal
  };

  const handleOpenAssignClientModal = (clientWork = null) => {
    setEditingClientWork(null); // Establece el cliente seleccionado para editar
    setIsClientModalOpen(true); // Abre el modal
  };

  const assignClient = async (requestData) => {
    try {
      if (requestData.id) {
        await axios.put(
          `${apiUrl}/api/v1/works/${requestData.workId}/work-client/${requestData.id}`,
          requestData
        );
        Swal.fire("¡Cliente actualizado con éxito!", "", "success");
      } else {
        await axios.post(
          `${apiUrl}/api/v1/works/${requestData.workId}/work-client`,
          requestData
        );
        Swal.fire("¡Cliente asignado con éxito!", "", "success");
      }
      setIsClientModalOpen(false);
      handleClientAdded(); // Cambia reloadClientWorks
    } catch (error) {
      Swal.fire("Error al guardar el cliente.", "", "error");
      console.error("Error al guardar el cliente:", error);
    }
  };

  if (!obra) {
    return (
      <div className="p-6 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Detalles de la Obra</h1>
        <p className="text-lg">No se encontró la obra seleccionada.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white min-h-screen">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6 text-center border-b pb-4 text-gray-800 dark:text-white">
          Detalles de la Obra
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Información básica de la obra */}
          <div>
            <p className="text-lg font-semibold flex items-center">
              <FaFileAlt className="mr-2 text-blue-500" /> Nombre:
            </p>
            <p className="mb-4 text-gray-700 dark:text-gray-300">{obra.name}</p>
          </div>
          <div>
            <p className="text-lg font-semibold flex items-center">
              <FaFileAlt className="mr-2 text-blue-500" /> Descripción:
            </p>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              {obra.description}
            </p>
          </div>

          {/* Fechas */}
          <div>
            <p className="text-lg font-semibold flex items-center">
              <FaCalendarAlt className="mr-2 text-green-500" /> Fecha Estimada
              de Inicio:
            </p>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              {obra.estimatedStartDate}
            </p>
          </div>
          <div>
            <p className="text-lg font-semibold flex items-center">
              <FaCalendarAlt className="mr-2 text-green-500" /> Fecha Estimada
              de Finalización:
            </p>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              {obra.estimatedEndDate}
            </p>
          </div>
          <div>
            <p className="text-lg font-semibold flex items-center">
              <FaCalendarAlt className="mr-2 text-purple-500" /> Fecha Real de
              Inicio:
            </p>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              {obra.actualStartDate || "No disponible"}
            </p>
          </div>
          <div>
            <p className="text-lg font-semibold flex items-center">
              <FaCalendarAlt className="mr-2 text-purple-500" /> Fecha Real de
              Finalización:
            </p>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              {obra.actualEndDate || "No disponible"}
            </p>
          </div>

          {/* Presupuesto */}
          <div>
            <p className="text-lg font-semibold flex items-center">
              <FaDollarSign className="mr-2 text-yellow-500" /> Presupuesto
              Asignado:
            </p>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              ${obra.allocatedBudget.toLocaleString("es-MX")}
            </p>
          </div>
          <div>
            <p className="text-lg font-semibold flex items-center">
              <FaDollarSign className="mr-2 text-yellow-500" /> Costo Real:
            </p>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              {obra.actualCost
                ? `$${obra.actualCost.toLocaleString("es-MX")}`
                : "No disponible"}
            </p>
          </div>

          {/* Dirección */}
          <div>
            <p className="text-lg font-semibold flex items-center">
              <FaMapMarkerAlt className="mr-2 text-red-500" /> Dirección:
            </p>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              {obra.address}
            </p>
          </div>
          <div>
            <p className="text-lg font-semibold flex items-center">
              <FaMapMarkerAlt className="mr-2 text-red-500" /> Ubicación:
            </p>
            <a
              href={`https://www.google.com/maps?q=${obra.latitude},${obra.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Ver en Google Maps
            </a>
          </div>

          {/* Proveedores */}
          <div>
            <div className="col-span-2">
              <p className="text-lg font-semibold flex items-center">
                <FaListUl className="mr-2 text-indigo-500" /> Proveedores:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                {obra.supplierNames?.length > 0 ? (
                  obra.supplierNames.map((supplier, index) => (
                    <li key={index}>{supplier}</li>
                  ))
                ) : (
                  <p>No se encontraron proveedores asociados.</p>
                )}
              </ul>
            </div>
          </div>

          <div>
            <p className="text-lg font-semibold flex items-center">
              <FaBarcode className="mr-2 text-blue-500" /> Código de la obra:
            </p>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              {obra.workCode}
            </p>
          </div>
          

          {/* Relaciones Cliente-Obra */}
          <div className="col-span-2 mt-6">
            <ClientWorkList
              apiUrl={apiUrl}
              workId={obra.idWork}
              reloadClientWorks={reloadClientWorks}
              onEditClientWork={handleEditClientWork}
            />
          </div>
        </div>

        {/* Botones */}
        <div className="mt-6 flex justify-center gap-4">
          <button
            className="bg-gray-500 text-white py-2 px-6 rounded-md hover:bg-gray-600 transition flex items-center gap-2"
            onClick={onBack}
          >
            <FaArrowLeft /> Volver al listado
          </button>

          {!obra.hasSchedule ? (
            <button
              className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition flex items-center gap-2"
              onClick={onOpenScheduleModal}
            >
              <FaPlus /> Crear Cronograma
            </button>
          ) : (
            <button
              className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition flex items-center gap-2"
              onClick={onViewSchedule}
            >
              <FaEye /> Ver Cronograma
            </button>
          )}

          <button
            className="bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition flex items-center gap-2"
            onClick={onOpenAssignSupplierModal}
          >
            <FaUserPlus /> Asignar Proveedor
          </button>

          <button
            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
            onClick={handleOpenAssignClientModal}
          >
            Asignar Cliente
          </button>
        </div>

        
        {isClientModalOpen && (
          <Modal closeModal={() => setIsClientModalOpen(false)}>
            <AssignClientForm
              workId={editingClientWork?.workId || obra.idWork} // Cambiar selectedObra por obra
              initialData={editingClientWork}
              onSave={assignClient}
              closeModal={() => setIsClientModalOpen(false)}
              apiUrl={apiUrl}
            />
          </Modal>
        )}
      </div>
    </div>
  );
};

export default ObrasDetails;
