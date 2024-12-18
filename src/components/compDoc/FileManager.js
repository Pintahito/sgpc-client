// FileManager.js
import React, { useState } from 'react';

const FileManager = () => {
  const [files, setFiles] = useState([]);

  const handleFileUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...uploadedFiles]);
  };

  const handleFileDelete = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">File Manager</h1>

      {/* File Upload */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="file-upload">
          Upload Files
        </label>
        <input
          type="file"
          id="file-upload"
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          multiple
          onChange={handleFileUpload}
        />
      </div>

      {/* File List */}
      <ul className="divide-y divide-gray-200">
        {files.length > 0 ? (
          files.map((file, index) => (
            <li key={index} className="py-4 flex items-center justify-between">
              <span className="text-gray-700 text-sm truncate max-w-[70%]">
                {file.name}
              </span>
              <button
                onClick={() => handleFileDelete(index)}
                className="text-red-500 hover:text-red-700 text-sm font-medium"
              >
                Delete
              </button>
            </li>
          ))
        ) : (
          <li className="text-gray-500 text-sm">No files uploaded yet.</li>
        )}
      </ul>
    </div>
  );
};

export default FileManager;