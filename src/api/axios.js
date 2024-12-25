import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8081", // URL del backend
});

// Configuración global de Axios para incluir el token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Recupera el token del almacenamiento local
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Añade el token en el header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;