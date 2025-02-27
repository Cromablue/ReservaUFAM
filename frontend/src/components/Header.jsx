import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const Header = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(); // Remove o token e desloga o usuário
        navigate("/"); // Redireciona para login
    };

    return (
        <header className="flex items-center justify-between bg-primary w-full h-16 p-10">
            <a href="/home">
                <img src={logo} alt="logo" className="absolute top-4 left-10 w-26 h-10" />
            </a>
            <nav>
                <ul className="flex items-center flex-row">
                    <li className="p-4 hover:text-blue-600">
                        <a href="/solicitar-reserva">Solicitar Reserva</a>
                    </li>
                    <li className="p-4 hover:text-blue-600">
                        <a href="/lista-reservas">Lista de Reservas</a>
                    </li>
                    <li className="p-4">
                        <button 
                            type="button" 
                            className="bg-red-600 text-white px-4 py-2 rounded-md"
                            onClick={handleLogout}
                        >
                            Sair
                        </button>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
