import React, { useEffect } from "react"; 
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import { FaArrowLeft } from "react-icons/fa";
import "../../css/fullcalendar-custom.css";

const ScheduleCalendar = ({ activities, onBack, schedule }) => {
  const calendarEvents = activities.map((activity) => ({
    title: `${activity.nameActivity} ${activity.status === "COMPLETADA" ? "✔️" : ""}`,
    start: activity.estimatedStartDate,
    status: activity.status,
    end: activity.estimatedEndDate,
    backgroundColor:
      activity.status === "COMPLETADA"
        ? "#4CAF50" 
        : activity.status === "PLANIFICADA"
        ? "#2196F3" 
        : activity.status === "EN_PROGRESO"
        ? "#FFC107" 
        : activity.status === "CANCELADA"
        ? "#F44336" 
        : "#9E9E9E", 
    borderColor:
      activity.status === "COMPLETADA"
        ? "#4CAF50"
        : activity.status === "PLANIFICADA"
        ? "#2196F3"
        : activity.status === "EN_PROGRESO"
        ? "#FFC107"
        : activity.status === "CANCELADA"
        ? "#F44336"
        : "#9E9E9E",
    textColor: "#FFFFFF",
  }));

  const completedActivities = activities.filter(
    (activity) => activity.status === "COMPLETADA"
  ).length;
  const totalActivities = activities.length;
  const progressPercentage = totalActivities
    ? Math.round((completedActivities / totalActivities) * 100)
    : 0;

  useEffect(() => {
    const toolbarTitle = document.querySelector(".fc-toolbar-title");
    const htmlElement = document.documentElement;

    const updateTitleColor = () => {
      if (toolbarTitle) {
        const isDarkMode = htmlElement.classList.contains("dark");
        toolbarTitle.style.color = isDarkMode ? "#ffffff" : "#000000";
      }
    };

    const observer = new MutationObserver(updateTitleColor);
    observer.observe(htmlElement, { attributes: true, attributeFilter: ["class"] });

    updateTitleColor();

    return () => observer.disconnect();
  }, []);

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white min-h-screen">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6 text-center border-b pb-4 dark:text-white">
          Calendario de Actividades
        </h1>

        {/* Información del Schedule */}
        <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            {schedule.name}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
            {schedule.description}
          </p>
          <span
            className={`inline-block px-3 py-1 mt-4 text-sm font-bold rounded-full text-white ${
              schedule.status === "PENDIENTE"
                ? "bg-yellow-500"
                : schedule.status === "COMPLETADO"
                ? "bg-green-500"
                : "bg-red-500"
            }`}
          >
            {schedule.status}
          </span>
        </div>

        {/* Barra de progreso */}
        <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            Progreso de las actividades
          </h3>
          <div className="w-full bg-gray-300 rounded-full h-4 dark:bg-gray-600">
            <div
              className="bg-blue-500 h-4 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
            {progressPercentage}% completado ({completedActivities} de {totalActivities} actividades completadas)
          </p>
        </div>

        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={calendarEvents}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,dayGridWeek,dayGridDay",
          }}
          locale={esLocale}
          buttonText={{
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            day: "Día",
            list: "Agenda",
          }}
          eventClick={(info) => alert(`Actividad: ${info.event.title} \n Status: ${info.event.extendedProps.status}`)}
          height="auto"
          contentHeight="auto"
          className="custom-calendar dark:text-white dark:bg-gray-900 dark:border-gray-700"
        />

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

export default ScheduleCalendar;
