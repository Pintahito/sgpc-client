import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080", // URL del backend
});

export default api;