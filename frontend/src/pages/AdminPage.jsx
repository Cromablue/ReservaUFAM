import React from 'react';

function AdminPage() {
    const reservas = [
        {
          id: 1,
          dataInicial: '2023-03-01',
          dataFinal: '2023-03-03',
          horaInicial: '10:00',
          horaFinal: '12:00',
          descricao: 'Reserva de exemplo',
          status: 'Pendente',
        },
        {
          id: 2,
          dataInicial: '2023-03-05',
          dataFinal: '2023-03-07',
          horaInicial: '14:00',
          horaFinal: '16:00',
          descricao: 'Outra reserva de exemplo',
          status: 'Pendente',
        },
      ];
    
      return (
        <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
          <h1 className="text-3xl font-bold mb-4">Reservas</h1>
          {reservas.map((reserva) => (
            <div key={reserva.id} className="bg-white shadow-md rounded-md p-4 mb-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-100 p-4 rounded-md">
                  <h2 className="text-2xl font-bold mb-2">Reserva {reserva.id}</h2>
                  <div className="flex flex-col">
                    <div className="flex justify-between mb-2">
                      <span className="text-lg font-bold">Data Inicial:</span>
                      <span className="text-lg">{reserva.dataInicial}</span>
                      <span className="text-lg font-bold ml-4">Data Final:</span>
                      <span className="text-lg">{reserva.dataFinal}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-lg font-bold">Hora Inicial:</span>
                      <span className="text-lg">{reserva.horaInicial}</span>
                      <span className="text-lg font-bold ml-4">Hora Final:</span>
                      <span className="text-lg">{reserva.horaFinal}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-lg font-bold">Status:</span>
                      <span className="text-lg">{reserva.status}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-lg font-bold mb-2">Descrição:</span>
                      <span className="text-lg">{reserva.descricao}</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md mr-2">Confirmar</button>
                  <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md">Rejeitar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

export default AdminPage;