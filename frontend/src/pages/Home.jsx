import { useEffect, useState } from "react";

function Home() {
  const [reservations, setReservations] = useState([]);
  const [message, setMessage] = useState("Carregando...");

  useEffect(() => {
    // Fetch para obter as reservas do usuário
    const fetchReservations = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/reservations"); // URL da API Django
        const data = await response.json();
        setReservations(data);
        if (data.length > 0) {
          const recentReservation = data[data.length - 1]; // Pega a reserva mais recente
          setMessage(`Sua reserva de ${recentReservation.resource} no dia ${recentReservation.date} às ${recentReservation.time} está ${recentReservation.status}.`);
        } else {
          setMessage("Você não tem reservas.");
        }
      } catch (error) {
        setMessage("Erro ao conectar com o backend");
      }
    };

    fetchReservations();
  }, []);

  return (
    <div className="p-6  rounded-lg shadow-md w-1/2 h-80">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Bem-vindo ao Reserve!</h1>
      <p className="mb-4">Resposta do Django: {message}</p>
    </div>
  );
}

export default Home;