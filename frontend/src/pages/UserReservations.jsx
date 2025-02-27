import React, { useEffect, useState } from "react";

function UserReservations() {
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        const fetchReservations = async () => {
            const response = await fetch("/api/reservations"); // Exemplo de endpoint
            const data = await response.json();
            setReservations(data);
        };

        fetchReservations();
    }, []);

    return (
        <div className="p-6 border-2 border-gray-300 rounded-lg shadow-md w-1/2 h-80">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Minhas Reservas</h1>
            {reservations.length > 0 ? (
                <ul className="space-y-4">
                    {reservations.map((reservation) => (
                        <li key={reservation.id} className="bg-white p-4 rounded-lg shadow">
                            <div className="reservation-details">
                                <p className="font-semibold">Reserva ID: <span className="font-normal">{reservation.id}</span></p>
                                <p className="font-semibold">Data: <span className="font-normal">{reservation.date}</span></p>
                                <p className="font-semibold">Status: <span className="font-normal">{reservation.status}</span></p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-600 italic">Você não tem reservas.</p>
            )}
        </div>
    );
}

export default UserReservations;