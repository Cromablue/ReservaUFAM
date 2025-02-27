import { useEffect, useState } from "react";
import Header from "../components/Header";

function Home() {
  const [message, setMessage] = useState("Carregando...");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/") // URL da API Django
      .then((response) => response.json())
      .then((data) => setMessage(data.message)) // Supondo que a API retorna { "message": "Olá do Django!" }
      .catch((error) => setMessage("Erro ao conectar com o backend"));
  }, []);

  return (
    <div>
      <Header/>
      <h1>Bem-vindo ao Reserve!</h1>
      <p>Resposta do Django: {message}</p>
    </div>
  );
}

export default Home;
