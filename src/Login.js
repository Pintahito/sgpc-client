import React, { useState } from "react";
import axios from "./api/axios"; // Importa Axios configurado
import { useNavigate } from "react-router-dom";
import { FaLock, FaUser } from "react-icons/fa";
import Swal from 'sweetalert2';

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("/api/auth/login", { username, password });
            localStorage.setItem("token", response.data.token);
            navigate("/dashboard");
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                background: '#333',
                color: '#fff',
                iconColor: '#4caf50',
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                }
            });
            Toast.fire({
                icon: 'success',
                title: 'Has Iniciado Sesión',
                customClass: { popup: 'colored-toast' }
            }); 
            // Añade CSS para la clase customClass 
            const styles = document.createElement('style'); 
            styles.innerHTML = ` .swal2-toast .swal2-title { font-size: 1.5em; } .swal2-toast { box-shadow: 0 0 15px rgba(0, 0, 0, 0.3); } .colored-toast { border-radius: 10px; } `; 
            document.head.appendChild(styles);
        } catch (err) {
            setError("Credenciales inválidas o acceso denegado");
        }
    };


    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-800 to-red-700">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
                <div className="text-center mb-6">
                    <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYOyln4kwaggy0dR6EWDsh9Kfvs6OiE7-Dhg&s"
                        alt="Logo Constructora"
                        className="w-24 h-24 mx-auto"
                    />
                    <h1 className="text-2xl font-bold text-gray-800 mt-2">Grupo Ingenios</h1>
                    <p className="text-gray-500">Accede a tu cuenta para gestionar proyectos</p>
                </div>
                {error && <p className="text-red-700 text-sm text-center mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <FaUser className="absolute left-3 top-3 text-red-700" />
                        <input
                            type="search"
                            placeholder="Usuario"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:outline-none"
                        />
                    </div>
                    <div className="relative">
                        <FaLock className="absolute left-3 top-3 text-red-700" />
                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:outline-none"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-red-700 text-white py-2 rounded-lg hover:bg-blue-800 transition"
                    >
                        Iniciar sesión
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
