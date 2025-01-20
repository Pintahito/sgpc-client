import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AssignSupplierForm = ({ workId, onSave, closeModal, apiUrl }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/v1/suppliers`);
        setSuppliers(response.data);
      } catch (error) {
        Swal.fire("Error", "No se pudieron cargar los proveedores.", "error");
        console.error("Error al cargar los proveedores:", error);
      }
    };

    fetchSuppliers();
  }, [apiUrl]);

  const handleAssign = () => {
    if (!selectedSupplier) {
      Swal.fire("Advertencia", "Debe seleccionar un proveedor.", "warning");
      return;
    }

    onSave(workId, selectedSupplier);
  };

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-8 text-gray-800 dark:text-white">
        Asignar Proveedor
      </h2>

      <div className="mb-8">
        <label
          htmlFor="supplier-select"
          className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Seleccione un proveedor
        </label>
        <select
          className="block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md  bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
          value={selectedSupplier}
          onChange={(e) => setSelectedSupplier(Number(e.target.value))} // Convertir a número
        >
          <option value="">Seleccione un proveedor</option>
          {suppliers.map((supplier) => (
            <option key={supplier.id_supplier} value={supplier.id_supplier}>
              {supplier.name}
            </option>
          ))}
        </select>
      </div>

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
          Asignar
        </button>
      </div>
    </div>
  );
};

export default AssignSupplierForm;
