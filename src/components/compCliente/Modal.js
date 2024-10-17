import React from 'react';

const Modal = ({ closeModal, children }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg relative">
        <button
          className="absolute top-0 right-0 m-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
          onClick={closeModal}>
          X
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
