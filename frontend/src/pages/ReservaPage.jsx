import React from "react";
import logo from "../assets/logo.png";
function ReservaPage() {
    return (
        <section className="flex items-center justify-center flex-col gap-4">
                      
            <header className="flex items-center justify-between bg-primary w-full h-16 p-10">
                <a href="/">
                    <img src={logo} alt="logo" className="absolute top-4 left-10 w-26 h-10" />
                </a>
                <nav className="">
                    <ul className="flex items-center flex-row">
                        <li className="p-4 hover:text-blue-600">
                            <a href="/">Solicitar Reserva</a>
                        </li>
                        <li className="p-4 hover:text-blue-600">
                            <a href="/">Lista de Reservas</a>
                        </li>
                        
                        <button  type="button" className="bg-red-600 text-white px-2 py-1 rounded-md justify-self-end">Sair</button>
                    </ul>
                </nav>
            </header>
                        
            
                

            <div className="border-2 border-gray-300 rounded-lg p-6 w-1/2 flex flex-col items-center">
            <h2 className="text-2xl font-bold text-center mb-4">Solicitação de Reserva</h2>

            <label htmlFor="reserva" className="font-bold flex items-center gap-4 mb-4">
                Selecione o tipo de reserva:
                <select id="reserva" name="reserva" className="border-2 border-gray-300 rounded-lg p-2 font-normal">
                    <option value="">Selecione</option>
                    <option value="sala">Sala de Reunião</option>
                    <option value="auditorio">Auditório</option>
                    <option value="veiculo">Veículo</option>
                </select>
            </label>

            <form className="flex flex-col gap-4 w-full">
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-4">
                        <label htmlFor="data-inicial" className="font-bold">Data inicial:</label>
                        <input type="date" id="data-inicial" name="data_inicial" required className="border-2 border-gray-300 rounded-lg p-2" />

                        <label htmlFor="horario-inicial" className="font-bold">Horário inicial:</label>
                        <input type="time" id="horario-inicial" name="horario_inicial" required className="border-2 border-gray-300 rounded-lg p-2" />
                    </div>

                    <div className="flex flex-col gap-4">
                        <label htmlFor="data-final" className="font-bold">Data final:</label>
                        <input type="date" id="data-final" name="data_final" required className="border-2 border-gray-300 rounded-lg p-2" />

                        <label htmlFor="horario-final" className="font-bold">Horário final:</label>
                        <input type="time" id="horario-final" name="horario_final" required className="border-2 border-gray-300 rounded-lg p-2" />
                    </div>
                </div>

                <label htmlFor="descricao" className="font-bold">Descrição:</label>
                <textarea id="descricao" name="descricao" rows="4" placeholder="Detalhes sobre a reserva..." className="border-2 border-gray-300 rounded-lg p-2"></textarea>

                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg self-center">Reservar</button>
            </form>
        </div>

             
        </section>
      );
    }

export default ReservaPage