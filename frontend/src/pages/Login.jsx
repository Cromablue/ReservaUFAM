import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import {Link} from 'react-router-dom';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(""); // Limpa erros anteriores

        try {
            const response = await fetch('http://localhost:8000/api/auth/token/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.non_field_errors?.[0] || "Erro ao fazer login");
            }

            const data = await response.json();
            login(data.auth_token); // Armazena o token
            navigate("/home"); // Redireciona para Home

        } catch (err) {
            setError(err.message);
        }
    };
    

    return (
        <section className="flex items-center justify-between flex-col gap-4">
            <img src={logo} alt="logo" className="w-26 h-20" />
            <div className="border-2 border-gray-300 rounded-md p-4 w-60 h-60">
                <form onSubmit={handleLogin}>
                    <label htmlFor="username">Usuário: </label>
                    <input
                        type="text"
                        value={username}
                        style={{border: "1px solid #ccc"}}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Usuário"
                        required
                    />
                    <label htmlFor="password">Senha: </label>
                    <input
                        type="password"
                        value={password}
                        style={{border: "1px solid #ccc"}}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Senha"
                        required
                    />

                    {/* Exibir mensagem de erro se houver */}
                    {error && <p style={{ color: "red" }}>{error}</p>}

                    <div className="mb-6 flex justify-between flex-col">
                        {/* <Link to="/" className="text-primary">Esqueceu sua senha?</Link> */}
                        <Link to="/register" className="text-primary">Primeiro acesso</Link>
                    </div>

                    {/* <!-- Submit button --> */}
                    <div className="flex items-center justify-center">
                        <button
                        type="submit"
                        className="bg-green-600 text-white px-4 py-2 rounded-md items-center justify-center"
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
