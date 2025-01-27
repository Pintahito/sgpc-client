import React, { useState, useEffect } from "react";
import axios from "axios";
import ObrasForm from "./ObrasForm";
import ObrasList from "./ObrasList";
import Modal from "./Modal";
import Swal from "sweetalert2";
import ObrasDetails from "./ObrasDetails";
import ScheduleForm from "./ScheduleForm";
import AssignSupplierForm from "./AssignSupplierForm";
import ScheduleView from "./ScheduleView";
import ScheduledActivityDetails from "../compSchedule/ScheduledActivityDetails";


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
  const [selectedActivity, setSelectedActivity] = useState(null); // Nueva: actividad seleccionada
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

  // Fetch para obras details
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
      if (error.response) {
        const { data } = error.response;
        Swal.fire({
          icon: "error",
          title: "Error al agregar obra",
          text: data.message || "No se pudo agregar al cliente",
          confirmButtonText: "Entendido",
        });
      }
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

  const [selectedSchedule, setSelectedSchedule] = useState(null);

  // Ver detalles del cronograma
  const fetchScheduleDetails = async (idWork) => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/v1/works/${idWork}/schedule`
      );
      setSelectedObra((prevObra) => ({
        ...prevObra,
        schedule: response.data, // Opcional: añade el cronograma a selectedObra
      }));
      setSelectedSchedule(response.data); // Almacena el cronograma específico
      setViewMode("schedule"); // Cambia la vista al cronograma
    } catch (error) {
      console.error("Error al obtener los detalles del cronograma:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los detalles del cronogramaaa.",
      });
    }
  };


  // Función para ver los detalles de una actividad
  const handleActivityView = (activity) => {
    setSelectedActivity(activity); // Guardar actividad seleccionada
    setViewMode("scheduledActivityDetails"); // Cambiar vista a detalles de actividad
  };

  // Función para regresar a la vista del cronograma
  const closeActivityDetails = () => {
    setSelectedActivity(null);
    setViewMode("schedule");
  };


  //asignar para ver cronograma

  /* const handleViewSchedule = () => {
     console.log("Ver cronograma:", selectedObra.schedule);
   };
 */

 

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
      if (error.response) {
        const { data } = error.response;
        Swal.fire({
          icon: "error",
          title: "Error al eliminar obra",
          text: data.message || "No se pudo agregar al cliente",
          confirmButtonText: "Entendido",
        });
      }
      console.error("Error al eliminar obra:", error);
    }
  };

  // Asignar/editar cliente
  

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
          <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Gestión de Obras</h1>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
            onClick={() => {
              setModalType("add");
              setIsModalOpen(true);
            }}
          >
            Agregar Obra
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
                <p className="mb-4 mt-4">
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

          <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-800 dark:text-white">Lista de Obras</h2>
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
            onViewSchedule={() => fetchScheduleDetails(selectedObra.idWork)} // Aquí se conecta directamente fetchScheduleDetails
            onOpenAssignSupplierModal={handleOpenAssignSupplierModal}
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
          
        </>
      )}
      {viewMode === "schedule" && selectedSchedule && (
        <ScheduleView
          schedule={selectedSchedule} // Pasa el cronograma como prop
          obra={selectedObra} // Opcional: pasa información de la obra
          onBack={() => setViewMode("details")} // Función para volver a la vista anterior
          apiUrl={apiUrl}
          onActivityView={handleActivityView} // Nueva prop para manejar "Ver actividad"
        />
      )}

      {/* Vista de detalles de actividad programada */}
      {viewMode === "scheduledActivityDetails" && selectedActivity && (
        <ScheduledActivityDetails
          activity={selectedActivity}
          onBack={closeActivityDetails} // Regresa al cronograma
          apiUrl={apiUrl}
        />
      )}
    </div>
  );
};

export default Obras;
