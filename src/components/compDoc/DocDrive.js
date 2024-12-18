/* eslint-disable no-use-before-define */
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { gapi } from 'gapi-script';

const CLIENT_ID = '1018171855854-i426aq2rp5u7ms9t1datjh3lcdonjlr2.apps.googleusercontent.com'; // Reemplaza con tu Client ID
const API_KEY = 'AIzaSyD7n2T2TAgpCnSgVhrdSAQlntu8a1j1AzY'; // Reemplaza con tu API Key
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

function DocDrive() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [file, setFile] = useState(null);
  const [filesList, setFilesList] = useState([]);

  // Inicializar Google API client
  useEffect(() => {
    const initClient = async () => {
      try {
        await gapi.load('client:auth2', () => {
          gapi.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            scope: SCOPES,
          });
        });
      } catch (error) {
        console.error('Error al inicializar GAPI:', error);
      }
    };

    initClient();
  }, []);

  // Manejo de inicio de sesión
  const handleSignIn = async () => {
    try {
      const authInstance = gapi.auth2.getAuthInstance();
      const user = await authInstance.signIn();
      const token = user.getAuthResponse().access_token;
      setAccessToken(token);
      setIsSignedIn(true);
      Swal.fire('Conectado', 'Inicio de sesión exitoso', 'success');
      listFiles();
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      Swal.fire('Error', 'No se pudo iniciar sesión', 'error');
    }
  };

  // Manejo de cierre de sesión
  const handleSignOut = () => {
    const authInstance = gapi.auth2.getAuthInstance();
    authInstance.signOut();
    setIsSignedIn(false);
    setAccessToken(null);
    setFilesList([]);
    Swal.fire('Desconectado', 'Has cerrado sesión', 'info');
  };

  // Subir archivo a Google Drive
  const uploadFile = async () => {
    if (!file) {
      Swal.fire('Error', 'No has seleccionado un archivo', 'error');
      return;
    }

    try {
      const metadata = {
        name: file.name,
        mimeType: file.type,
      };

      const formData = new FormData();
      formData.append(
        'metadata',
        new Blob([JSON.stringify(metadata)], { type: 'application/json' })
      );
      formData.append('file', file);

      const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (response.ok) {
        Swal.fire('Archivo Subido', `El archivo ${file.name} ha sido subido con éxito`, 'success');
        listFiles();
      } else {
        const error = await response.json();
        throw new Error(error.error.message);
      }
    } catch (error) {
      console.error('Error al subir el archivo:', error);
      Swal.fire('Error', 'No se pudo subir el archivo', 'error');
    }
  };

  // Listar archivos en Google Drive
  const listFiles = async () => {
    try {
      const response = await fetch('https://www.googleapis.com/drive/v3/files', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFilesList(data.files || []);
      } else {
        const error = await response.json();
        throw new Error(error.error.message);
      }
    } catch (error) {
      console.error('Error al listar archivos:', error);
      Swal.fire('Error', 'No se pudieron listar los archivos', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Documentos</h1>

      {!isSignedIn ? (
        <button
          onClick={handleSignIn}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Iniciar Sesión con Google
        </button>
      ) : (
        <>
          <button
            onClick={handleSignOut}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Cerrar Sesión
          </button>
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
                    onClick={() => window.open(`https://drive.google.com/file/d/${file.id}`, '_blank')}
                    className="text-blue-500 hover:underline"
                  >
                    Ver
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default DocDrive;
