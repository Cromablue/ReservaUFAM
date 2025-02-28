import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import SucessPopup from "../components/SucessPopup";
import ErrorPopup from "../components/ErrorPopup";

const Register = () => {
  const navigate = useNavigate();

  const [siape, setSiape] = useState("");
  const [cpf, setCpf] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [cellphone, setCellphone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showSucess, setShowSucess] = useState(false);
  const [mensagem, setMensagem] = useState("");

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateCPF = (cpf) => {
    cpf = cpf.replace(/\D/g, "");
    return cpf.length === 11;
  };

  const formatCPF = (value) => value
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");

  const formatPhone = (value) => value
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");

  const processName = (fullName) => {
    const nameParts = fullName.trim().split(/\s+/);
    if (nameParts.length < 2) return null;
    return { firstName: nameParts[0], lastName: nameParts[nameParts.length - 1] };
  };

  const handleBlur = (field, value) => {
    let newErrors = { ...errors };

    switch (field) {
      case "email":
        newErrors.email = validateEmail(value) ? "" : "Email inválido.";
        break;
      case "cpf":
        newErrors.cpf = validateCPF(value) ? "" : "CPF inválido.";
        break;
      case "name":
        newErrors.name = processName(value) ? "" : "Digite pelo menos um nome e um sobrenome.";
        break;
      case "password":
        newErrors.password = value.length >= 6 ? "" : "A senha deve ter pelo menos 6 caracteres.";
        break;
      case "confirmPassword":
        newErrors.confirmPassword = value === password ? "" : "As senhas não coincidem.";
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (Object.values(errors).some((err) => err)) return;
    
    const processedName = processName(name);
    if (!processedName) {
      setErrors((prev) => ({ ...prev, name: "Digite pelo menos um nome e um sobrenome." }));
      return;
    }

    console.log({
      siape,
      cpf: cpf.replace(/\D/g, ""),
      name,
      first_name: processedName.firstName,
      last_name: processedName.lastName,
      username,
      email,
      cellphone,
      password,
    });

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siape,
          cpf: cpf.replace(/\D/g, ""),
          name,
          first_name: processedName.firstName,
          last_name: processedName.lastName,
          username,
          email,
          cellphone,
          password,
        }),
      });

      if (!response.ok) throw new Error("Erro ao registrar usuário");

      setMensagem("Usuário criado com sucesso!");
      setShowSucess(true);
      navigate("/");
    } catch (err) {
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };


  return (
    <section className="flex items-center justify-center flex-col gap-6 py-8  min-h-screen">
      <div className="absolute left-5 flex items-center justify-center flex-col gap-6 py-8  min-h-screen">
        <a href="/" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="36" fill="currentColor" class="bi bi-arrow-left-short" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5"/>
        </svg>
        </a>
      </div>
      {/* Logo estilizada */}
      <img src={logo} alt="logo" className="w-22 h-13" />

      {/* Título estilizado */}
      <h2 className="text-4xl font-bold bg-gradient-to-r from-green-500 to-blue-500 text-transparent bg-clip-text">
        Cadastro
      </h2>

      {/* Formulário estilizado */}
      <div className="border border-gray-300 rounded-xl p-8 w-full max-w-2xl shadow-lg bg-white">
        <form onSubmit={handleRegister} className="grid grid-cols-2 gap-6">
          
          {/* Nome de Usuário */}
          <div>
            <label className="block font-medium">Nome de Usuário:</label>
            <input type="text" className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" value={username} onChange={(e) => setUsername(e.target.value)} required />
            {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
          </div>

          {/* Nome Completo */}
          <div>
            <label className="block font-medium">Nome Completo:</label>
            <input type="text" className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" value={name} onChange={(e) => setName(e.target.value)} onBlur={() => handleBlur("name", name)} required />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          {/* SIAPE */}
          <div>
            <label className="block font-medium">SIAPE:</label>
            <input type="text" className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" value={siape} maxLength={7} onChange={(e) => setSiape(e.target.value.replace(/\D/g, ""))}  required />
          </div>

          {/* CPF */}
          <div>
            <label className="block font-medium">CPF:</label>
            <input type="text" className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" value={cpf} onChange={(e) => setCpf(formatCPF(e.target.value))} onBlur={() => handleBlur("cpf", cpf)} required />
            {errors.cpf && <p className="text-red-500 text-sm">{errors.cpf}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block font-medium">Email:</label>
            <input type="email" className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => handleBlur("email", email)} required />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          {/* Telefone */}
          <div>
            <label className="block font-medium">Telefone:</label>
            <input type="text" className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" value={cellphone} onChange={(e) => setCellphone(formatPhone(e.target.value))} onBlur={() => handleBlur("cellphone", cellphone)} required />
            {errors.cellphone && <p className="text-red-500 text-sm">{errors.cellphone}</p>}
          </div>

          {/* Senha */}
          <div>
            <label className="block font-medium">Senha:</label>
            <input type="password" className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" value={password} onChange={(e) => setPassword(e.target.value)} onBlur={() => handleBlur("password", password)} required />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          {/* Confirmar Senha */}
          <div>
            <label className="block font-medium">Confirmar Senha:</label>
            <input type="password" className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} onBlur={() => handleBlur("confirmPassword", confirmPassword)}  required />
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
          </div>

          {/* Botão de Cadastrar */}
          <button type="submit" className="col-span-2 bg-green-600 text-white p-3 rounded-lg font-semibold w-full hover:bg-green-700 transition">
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>
      </div>

      {showError && <ErrorPopup error="Erro ao registrar usuário" onClose={() => setShowError(false)} />}
      {showSucess && <SucessPopup mensagem={mensagem} onClose={() => setShowSucess(false)} />}
    </section>
  );
};

export default Register;
