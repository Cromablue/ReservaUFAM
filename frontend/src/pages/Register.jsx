import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const Register = () => {
  const navigate = useNavigate();

  // Estados para armazenar os valores do formulário
  const [siape, setSiape] = useState("");
  const [cpf, setCpf] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [cellphone, setCellphone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:8000/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          siape,
          cpf,
          name,
          username,
          email,
          cellphone,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.detail || "Erro ao registrar usuário");
      }

      navigate("/"); // Redireciona para login após cadastro
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="flex items-center justify-center flex-col gap-4">
      <img src={logo} alt="logo" className="w-17 h-12" />
      <div className="text-2xl">Cadastro</div>

      {/* Formulário de Cadastro */}
      <div className="border-2 border-gray-300 rounded-md p-4 w-60 h-auto">
        <form onSubmit={handleRegister}>
          {/* Nome de Usuário */}
          <label htmlFor="username">Nome de Usuário:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ border: "1px solid #ccc", width: "100%", marginBottom: "10px" }}
            required
          />
            
          {/* Nome Completo */}
          <label htmlFor="name">Nome Completo:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ border: "1px solid #ccc", width: "100%", marginBottom: "10px" }}
            required
          />

          {/* SIAPE */}
          <label htmlFor="siape">SIAPE:</label>
          <input
            type="text"
            id="siape"
            value={siape}
            maxLength={7}
            onChange={(e) => setSiape(e.target.value.replace(/\D/g, ""))} // Permite apenas números
            style={{ border: "1px solid #ccc", width: "100%", marginBottom: "10px" }}
            required
          />

          {/* CPF */}
          <label htmlFor="cpf">CPF:</label>
          <input
            type="text"
            id="cpf"
            value={cpf}
            maxLength={11}
            onChange={(e) => setCpf(e.target.value.replace(/\D/g, ""))} // Permite apenas números
            style={{ border: "1px solid #ccc", width: "100%", marginBottom: "10px" }}
            required
          />

          {/* Email */}
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ border: "1px solid #ccc", width: "100%", marginBottom: "10px" }}
            required
          />

          {/* Telefone */}
          <label htmlFor="cellphone">Telefone:</label>
          <input
            type="text"
            id="cellphone"
            value={cellphone}
            maxLength={15}
            onChange={(e) => setCellphone(e.target.value.replace(/\D/g, ""))} // Permite apenas números
            style={{ border: "1px solid #ccc", width: "100%", marginBottom: "10px" }}
          />

          {/* Senha */}
          <label htmlFor="password">Senha:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ border: "1px solid #ccc", width: "100%", marginBottom: "10px" }}
            required
          />

          {/* Mensagem de erro */}
          {error && <p style={{ color: "red" }}>{error}</p>}

          {/* Botão de cadastro */}
          <div className="flex items-center justify-center p-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-md"
            >
              Cadastrar
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Register;
