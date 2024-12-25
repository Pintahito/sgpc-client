import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        axios.get("/api/auth/me", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}` // Usa el token almacenado
            }
        })
            .then(response => setUser(response.data))
            .catch(() => setUser(null));
    }, []);

    const logout = () => {
        axios.post("/api/auth/logout", {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then(() => {
            localStorage.removeItem("token");
            setUser(null);
        });
    };

    return (
        <AuthContext.Provider value={{ user, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

