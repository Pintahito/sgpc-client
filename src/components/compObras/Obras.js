import React, { useState, useEffect } from "react";
import axios from "axios";
import ObrasForm from "./ObrasForm";
import ObrasList from "./ObrasList";
import Modal from "./Modal";
import Swal from "sweetalert2";
import ObrasDetails from "./ObrasDetails";
import ScheduleForm from "./ScheduleForm";
import AssignSupplierForm from "./AssignSupplierForm";
import AssignClientForm from "./AssignClientForm";
import ScheduleView from "./ScheduleView";

const apiUrl = process.env.REACT_APP_API_URL;

const Obras = () => {
  // Estados de Obra
  const [obras, setObras] = useState([]);
  const [tipoObra, setTipoObras] = useState([]);
  const [obraEditada, setObraEditada] = useState(null);
  const [obraSeleccionada, setObraSeleccionada] = useState(null);
  const [viewMode, setViewMode] = useState("list");
  const [suppliers, setSuppliers] = useState([]);
  const [selectedObra, setSelectedObra] = useState(null);
  const [newObra, setNewObra] = useState({
    name: "",
    description: "",
    estimatedStartDate: "",
    estimatedEndDate: "",
    actualStartDate: "",
    actualEndDate: "",
    allocatedBudget: 0,
    actualCost: 0,
    address: "",
    workTypeId: 0,
    longitude: 0,
    latitude: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // Controla el tipo de modal ('add', 'edit', 'delete')

  // Estados para el cronograma
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    name: "",
    description: "",
    status: "PENDIENTE",
  });

  // Estado para asignar/editar cliente
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [editingClientWork, setEditingClientWork] = useState(null);

  // Estado para asignar proveedor
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);

  // Fetch de datos iniciales
  const fetchTipoObra = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/workTypes`);
      setTipoObras(response.data);
    } catch (error) {
      console.error("Error al obtener los tipos de obra:", error);
    }
  };

  const fetchObras = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/works`);
      setObras(response.data);
    } catch (error) {
      console.error("Error al obtener las obras:", error);
    }
  };

  const fetchObraDetails = async (idWork) => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/works/${idWork}`);
      setSelectedObra(response.data); // Actualiza el estado con la obra completa
      setViewMode("details"); // Cambia al modo de detalles
    } catch (error) {
      console.error("Error al obtener los detalles de la obra:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los detalles de la obra.",
      });
    }
  };

  // Guardar obra
  const saveObra = async (values) => {
    try {
      if (obraEditada) {
        await axios.put(`${apiUrl}/api/v1/works/${obraEditada.idWork}`, values);
        Swal.fire("¡Obra editada con éxito!");
      } else {
        await axios.post(`${apiUrl}/api/v1/works`, values);
        Swal.fire("¡Obra agregada con éxito!");
      }
      fetchObras();
      closeModal();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error al guardar la obra.",
      });
      console.error("Error al guardar obra:", error);
    }
  };

  // Guardar cronograma
  const saveSchedule = async (values) => {
    try {
      await axios.post(
        `${apiUrl}/api/v1/works/${selectedObra.idWork}/schedule`,
        values
      );
      Swal.fire("¡Cronograma creado con éxito!", "", "success");
      setSelectedObra((prevObra) => ({
        ...prevObra,
        hasSchedule: true,
      }));
      setIsScheduleModalOpen(false);
    } catch (error) {
      console.error("Error al crear el cronograma:", error);
      Swal.fire("Error al crear el cronograma", "", "error");
    }
  };

  //asignar para ver cronograma

  /* const handleViewSchedule = () => {
     console.log("Ver cronograma:", selectedObra.schedule);
   };
 */

  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const handleViewSchedule = () => {
    if (selectedObra?.hasSchedule) {
      setSelectedSchedule(selectedObra.hasSchedule);
      setViewMode("schedule");
      console.log('Ver cronograma:', selectedObra.hasSchedule);
    } else {
      Swal.fire("Esta obra no tiene un cronograma asignado.", "", "info");
    }
  };


  // Manejo de asignación de proveedor
  const handleOpenAssignSupplierModal = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/suppliers`);
      setSuppliers(response.data);
      setIsSupplierModalOpen(true);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los proveedores.",
      });
    }
  };

  // Asignar proveedor
  const assignSupplier = async (workId, supplierId) => {
    try {
      await axios.post(
        `${apiUrl}/api/v1/works/${workId}/suppliers/${supplierId}`
      );
      Swal.fire("¡Proveedor asignado con éxito!", "", "success");
      setIsSupplierModalOpen(false);
      fetchObraDetails(workId);
    } catch (error) {
      console.error("Error al asignar el proveedor:", error);
      Swal.fire("Error al asignar el proveedor", "", "error");
    }
  };

  // Eliminar obra
  const deleteObra = async () => {
    try {
      await axios.delete(`${apiUrl}/api/v1/works/${obraSeleccionada.idWork}`);
      Swal.fire("¡Obra eliminada con éxito!");
      fetchObras();
      closeDeleteModal();
    } catch (error) {
      console.error("Error al eliminar obra:", error);
    }
  };

  // Asignar/editar cliente
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
      fetchObraDetails(requestData.workId);
    } catch (error) {
      Swal.fire("Error al guardar el cliente.", "", "error");
      console.error("Error al guardar el cliente:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewObra({
      name: "",
      description: "",
      estimatedStartDate: "",
      estimatedEndDate: "",
      actualStartDate: "",
      actualEndDate: "",
      allocatedBudget: 0,
      actualCost: 0,
      address: "",
      workTypeId: 0,
      longitude: 0,
      latitude: 0,
    });
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setObraSeleccionada(null);
    setSelectedSchedule(null);
  };

  useEffect(() => {
    fetchObras();
    fetchTipoObra();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-500 text-gray-800 dark:text-white">
      {viewMode === "list" && (
        <>
          <h1 className="text-3xl font-bold mb-6">Gestión de Obras</h1>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
            onClick={() => {
              setModalType("add");
              setIsModalOpen(true);
            }}
          >
            Agregar
          </button>

          {isModalOpen && (modalType === "add" || modalType === "edit") && (
            <Modal closeModal={closeModal}>
              <ObrasForm
                obra={newObra}
                setObra={setNewObra}
                onSave={saveObra}
                obraEditada={obraEditada}
                tipoObra={tipoObra}
                handleInputChange={(e) =>
                  setNewObra({ ...newObra, [e.target.name]: e.target.value })
                }
                closeModal={closeModal}
              />
            </Modal>
          )}

          {isDeleteModalOpen && modalType === "delete" && (
            <Modal closeModal={closeDeleteModal}>
              <div className="text-center">
                <p className="mb-4">
                  ¿Estás seguro de que deseas eliminar la obra,{" "}
                  {obraSeleccionada?.name}?
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition"
                    onClick={deleteObra}
                  >
                    Eliminar
                  </button>
                  <button
                    className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition"
                    onClick={closeDeleteModal}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </Modal>
          )}

          <h2 className="text-2xl font-semibold mt-6 mb-4">Lista de Obras</h2>
          <ObrasList
            obras={obras}
            setObraEditada={(obra) => {
              setObraEditada(obra);
              setNewObra(obra);
              setModalType("edit");
              setIsModalOpen(true);
            }}
            setObraSeleccionada={(obra) => {
              setObraSeleccionada(obra);
              setModalType("delete");
              setIsDeleteModalOpen(true);
            }}
            setModalType={setModalType}
            setSelectedObra={setSelectedObra}
            setViewMode={setViewMode}
            fetchObraDetails={fetchObraDetails}
          />
        </>
      )}
      {viewMode === "details" && selectedObra && (
        <>
          <ObrasDetails
            obra={selectedObra}
            onBack={() => setViewMode("list")}
            onOpenScheduleModal={() => setIsScheduleModalOpen(true)}
            onViewSchedule={handleViewSchedule}
            onOpenAssignSupplierModal={handleOpenAssignSupplierModal}
            onOpenAssignClientModal={(clientWork) => {
              setEditingClientWork(clientWork);
              setIsClientModalOpen(true);
            }}
            apiUrl={apiUrl}
          />
          {isScheduleModalOpen && (
            <Modal closeModal={() => setIsScheduleModalOpen(false)}>
              <ScheduleForm
                schedule={newSchedule}
                setSchedule={setNewSchedule}
                onSave={saveSchedule}
                closeModal={() => setIsScheduleModalOpen(false)}
              />
            </Modal>
          )}
          {isSupplierModalOpen && (
            <Modal closeModal={() => setIsSupplierModalOpen(false)}>
              <AssignSupplierForm
                workId={selectedObra.idWork}
                suppliers={suppliers}
                onSave={assignSupplier}
                closeModal={() => setIsSupplierModalOpen(false)}
                apiUrl={apiUrl}
              />
            </Modal>
          )}
          {isClientModalOpen && (
            <Modal closeModal={() => setIsClientModalOpen(false)}>
              <AssignClientForm
                workId={editingClientWork?.workId || selectedObra.idWork}
                initialData={editingClientWork}
                onSave={assignClient}
                closeModal={() => setIsClientModalOpen(false)}
                apiUrl={apiUrl}
              />
            </Modal>
          )}
        </>
      )}
      {viewMode === "schedule" && selectedSchedule && (
        <ScheduleView
          //schedule={selectedSchedule}
          obra={selectedObra}
          onBack={() => setViewMode("details")}
        />
      )}
    </div>
  );
};

export default Obras;
