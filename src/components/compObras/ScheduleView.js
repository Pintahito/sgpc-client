import React from "react";

const ScheduleView = ({ obra, onBack }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-700">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        Cronograma de la Obra
      </h1>
      <h2 className="text-2xl font-semibold mb-4 text-gray-600 dark:text-gray-300">
        {obra.name}
      </h2>
      {obra.schedule && obra.schedule.length > 0 ? (
        <ul className="list-disc ml-6 text-gray-700 dark:text-gray-200">
          {obra.schedule.map((task, index) => (
            <li key={index} className="mb-2">
              <strong>{task.name}</strong>: {task.description} -{" "}
              <span
                className={`font-semibold ${
                  task.status === "completo"
                    ? "text-green-500"
                    : "text-yellow-500"
                }`}
              >
                {task.status}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 dark:text-gray-400">
          No hay cronograma disponible para esta obra.
        </p>
      )}
      <button
        className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition mt-4"
        onClick={onBack}
      >
        Regresar
      </button>
    </div>
  );
};

export default ScheduleView;
