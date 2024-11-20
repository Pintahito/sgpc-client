import React, { useEffect, useState } from 'react';
import { gapi } from 'gapi-script';
import Swal from 'sweetalert2';

const CLIENT_ID = 'TU_CLIENT_ID';
const API_KEY = 'TU_API_KEY';
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

function DocDrive() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [file, setFile] = useState(null);
  const [filesList, setFilesList] = useState([]);

  useEffect(() => {
    const start = () => {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        scope: SCOPES,
      });
    };
    gapi.load('client:auth2', start);
  }, []);

  const handleAuthClick = () => {
    gapi.auth2.getAuthInstance().signIn().then(() => {
      setIsSignedIn(true);
      Swal.fire('Conectado', 'Has iniciado sesión con Google Drive', 'success');
      listFiles();
    });
  };

  const handleSignOutClick = () => {
    gapi.auth2.getAuthInstance().signOut().then(() => {
      setIsSignedIn(false);
      Swal.fire('Desconectado', 'Has cerrado sesión', 'info');
      setFilesList([]);
    });
  };

  const uploadFile = async () => {
    if (!file) {
      Swal.fire('Error', 'No has seleccionado un archivo', 'error');
      return;
    }

    const form = new FormData();
    form.append('file', file);
    const boundary = 'foo_bar_baz';

    const metadata = {
      name: file.name,
      mimeType: file.type,
    };

    const requestBody =
      `--${boundary}\r\n` +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(metadata) + '\r\n' +
      `--${boundary}\r\n` +
      `Content-Type: ${file.type}\r\n\r\n` +
      file + '\r\n' +
      `--${boundary}--`;

    try {
      const response = await gapi.client.request({
        path: '/upload/drive/v3/files',
        method: 'POST',
        params: { uploadType: 'multipart' },
        headers: {
          'Content-Type': `multipart/related; boundary=${boundary}`,
        },
        body: requestBody,
      });
      Swal.fire('Archivo Subido', `El archivo ${file.name} ha sido subido con éxito`, 'success');
      listFiles();
    } catch (error) {
      Swal.fire('Error', 'No se pudo subir el archivo', 'error');
    }
  };

  const listFiles = async () => {
    try {
      const response = await gapi.client.drive.files.list({
        pageSize: 10,
        fields: 'files(id, name)',
      });
      setFilesList(response.result.files);
    } catch (error) {
      Swal.fire('Error', 'No se pudieron listar los archivos', 'error');
    }
  };

  const handleDownload = (fileId, fileName) => {
    const url = `https://drive.google.com/uc?id=${fileId}&export=download`;
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Documentos de la Constructora</h1>
      {!isSignedIn ? (
        <button
          onClick={handleAuthClick}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Iniciar Sesión con Google
        </button>
      ) : (
        <button
          onClick={handleSignOutClick}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Cerrar Sesión
        </button>
      )}

      {isSignedIn && (
        <div className="mt-4 w-full max-w-md">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="mb-2"
          />
          <button
            onClick={uploadFile}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
          >
            Subir Archivo
          </button>

          <h2 className="text-xl font-semibold mt-4">Archivos en Google Drive</h2>
          <ul className="list-disc pl-5">
            {filesList.map((file) => (
              <li key={file.id} className="flex justify-between items-center">
                <span>{file.name}</span>
                <button
                  onClick={() => handleDownload(file.id, file.name)}
                  className="text-blue-500 hover:underline"
                >
                  Descargar
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default DocDrive;
