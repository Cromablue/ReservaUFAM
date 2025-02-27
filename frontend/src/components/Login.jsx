import React, { useState } from "react";
import logo from "../assets/logo.png";

const Login = () => {
  const [formData, setFormData] = useState({
    identifier: "", // Pode ser email, username ou siape
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch('http://127.0.0.1:8000/api/login/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            identifier: formData.identifier, // Pode ser email, username ou siape
            password: formData.password,
        }),
    });

    // Verificando a resposta antes de tentar parsear
    const text = await response.text();  // Obtém a resposta como texto
    console.log(text);  // Verifica o que está sendo retornado

    try {
        const data = JSON.parse(text);  // Tenta fazer o parse
        if (response.ok) {
            localStorage.setItem('token', data.token);
            console.log('Login bem-sucedido:', data);
        } else {
            console.error('Erro ao fazer login:', data);
        }
    } catch (error) {
        console.error('Erro ao fazer o parse do JSON:', error);
    }
};


  return (
    <section className="flex items-center justify-center flex-col gap-4">
      <img src={logo} alt="logo" className="w-26 h-20" />
      <div className="border-2 border-gray-300 rounded-md p-4 w-60 h-60">
        <form onSubmit={handleLogin}>
          <label htmlFor="identifier">Identificador (email, username ou SIAPE): </label>
          <input
            type="text"
            name="identifier"
            value={formData.identifier}
            onChange={handleChange}
            style={{ border: "1px solid #ccc" }}
          />

          <label htmlFor="password">Senha: </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            style={{ border: "1px solid #ccc" }}
          />

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
