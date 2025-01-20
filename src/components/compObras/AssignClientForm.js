import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AssignClientForm = ({ workId, onSave, closeModal, apiUrl, initialData = null }) => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [role, setRole] = useState("PRINCIPAL");
  const [status, setStatus] = useState("ACTIVO");

  // Cargar lista de clientes
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/v1/clients`);
        setClients(response.data);
        console.log("Clientes cargados:", response.data);
      } catch (error) {
        Swal.fire("Error", "No se pudieron cargar los clientes.", "error");
        console.error("Error al cargar los clientes:", error);
      }
    };

    fetchClients();
  }, [apiUrl]);

  // Sincronizar valores iniciales al editar
  useEffect(() => {
    if (initialData && clients.length > 0) {
      console.log("InitialData.clientId:", initialData.clientId);
      console.log("Clients disponibles:", clients);

      // Convertir ambos valores a cadenas para evitar problemas de tipo
      const matchingClient = clients.find(
        (client) => String(client.idClient) === String(initialData.clientId)
      );

      if (matchingClient) {
        setSelectedClient(matchingClient.idClient); // Asignar cliente coincidente
        console.log("Cliente encontrado:", matchingClient);
      } else {
        console.warn("No se encontró un cliente que coincida con el ID proporcionado.");
      }

      setRole(initialData.role || "PRINCIPAL");
      setStatus(initialData.status || "ACTIVO");
    }
  }, [initialData, clients]); // Añade 'clients' como dependencia

  // Manejar la asignación o edición
  const handleAssign = () => {
    if (!selectedClient) {
      Swal.fire("Advertencia", "Debe seleccionar un cliente.", "warning");
      return;
    }

    const requestData = {
      id: initialData?.id, // Si es edición, incluye el ID
      clientId: selectedClient,
      workId,
      role,
      assignedAt: new Date().toISOString(),
      status,
    };

    onSave(requestData);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        {initialData ? "Editar Cliente" : "Asignar Cliente"}
      </h2>
  
      {/* Cliente */}
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
          Cliente
        </label>
        <select
          className="block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
          value={selectedClient}
          onChange={(e) => setSelectedClient(Number(e.target.value))}
        >
          <option value="">Seleccione un cliente</option>
          {clients.map((client) => (
            <option
              key={client.idClient}
              value={client.idClient}
              className="p-2"
            >
              {client.name}
            </option>
          ))}
        </select>
      </div>
  
      {/* Rol */}
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
          Rol
        </label>
        <select
          className="block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="PRINCIPAL">PRINCIPAL</option>
          <option value="SECUNDARIO">SECUNDARIO</option>
        </select>
      </div>
  
      {/* Estado */}
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
          Estado
        </label>
        <select
          className="block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="ACTIVO">ACTIVO</option>
          <option value="INACTIVO">INACTIVO</option>
        </select>
      </div>
  
      {/* Botones */}
      <div className="flex justify-end gap-4">
        <button
          className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition"
          onClick={closeModal}
        >
          Cancelar
        </button>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          onClick={handleAssign}
        >
          {initialData ? "Guardar Cambios" : "Asignar"}
        </button>
      </div>
    </div>
  );
};

export default AssignClientForm;