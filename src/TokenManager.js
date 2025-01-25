import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";

const TokenManager = () => {
    const navigate = useNavigate();
  
    useEffect(() => {
      const checkTokenExpiration = () => {
        const token = localStorage.getItem("token");
        if (!token) return;
  
        try {
          const decodedToken = jwtDecode(token);
          const currentTime = Math.floor(Date.now() / 1000);
          const expirationTime = decodedToken.exp;
          const timeLeft = expirationTime - currentTime;
  
  
          if (timeLeft <= 0) {
            localStorage.removeItem("token");
            Swal.fire({
              title: "Sesión expirada",
              text: "Tu sesión ha finalizado. Por favor, vuelve a iniciar sesión.",
              icon: "warning",
              confirmButtonText: "Aceptar",
            }).then(() => {
              navigate("/login");
            });
          } else if (timeLeft <= 60) {
            Swal.fire({
              title: "Sesión por expirar",
              text: "Tu sesión está por expirar en menos de 1 minuto. Guarda tu trabajo.",
              icon: "info",
              confirmButtonText: "Entendido",
            });
          }
        } catch (error) {
          console.error("Error al decodificar el token:", error);
        }
      };
  
      const interval = setInterval(checkTokenExpiration, 10000);
      return () => clearInterval(interval);
    }, [navigate]);
  
    return null
  };

export default TokenManager;