import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        setError(""); // Limpa erros anteriores
        
        // 🔹 Apenas simula um login bem-sucedido e navega para a Home
        navigate("/home");
    };

    return (
        <section className="flex items-center justify-center flex-col gap-4">
            <img src={logo} alt="logo" className="w-17 h-12" />
            <div className="border-2 border-gray-300 rounded-md p-4 w-60 h-60">
                <form onSubmit={handleLogin}>
                    <label htmlFor="username">Usuário: </label>
                    <input
                        type="text"
                        value={username}
                        style={{ border: "1px solid #ccc" }}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Usuário"
                        required
                    />
                    <label htmlFor="password">Senha: </label>
                    <input
                        type="password"
                        value={password}
                        style={{ border: "1px solid #ccc" }}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Senha"
                        required
                    />

                    {/* Exibir mensagem de erro se houver */}
                    {error && <p style={{ color: "red" }}>{error}</p>}

                    <div className="mb-6 flex justify-between flex-col">
                        <Link 
                            to="/register" 
                            className="text-blue-600 hover:underline hover:text-blue-800 transition duration-200"
                        >
                            Primeiro acesso
                        </Link>
                    </div>

                    {/* <!-- Submit button --> */}
                    <div className="flex items-center justify-center">
                        <button
                            type="submit"
                            className="bg-green-600 text-white px-4 py-2 rounded-md"
                        >
                            Entrar
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default Login;
