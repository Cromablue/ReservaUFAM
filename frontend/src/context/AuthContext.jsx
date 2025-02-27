import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../../api"; // Sua configuração do Axios

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    await api.get("/auth/validate-token", {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setIsAuthenticated(true);
                } catch (error) {
                    localStorage.removeItem("token");
                    setIsAuthenticated(false);
                    window.location.href = "/"; // 🔥 Redireciona corretamente
                }
            }
        };

        checkAuth();
    }, []);

    const login = (token) => {
        localStorage.setItem("token", token);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        window.location.href = "/"; // 🔥 Redireciona corretamente
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth deve ser usado dentro de um AuthProvider");
    }
    return context;
};
