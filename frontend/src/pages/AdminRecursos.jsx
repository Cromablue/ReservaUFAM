import React, { useState } from 'react';

function AdminRecursos() {
  const [auditorios, setAuditorios] = useState([
    { id: 1, nome: 'Auditório 1' },
    { id: 2, nome: 'Auditório 2' },
  ]);

  const [veiculos, setVeiculos] = useState([
    { id: 1, placa: 'ABC-1234' },
    { id: 2, placa: 'DEF-5678' },
  ]);

  const [salasConferencia, setSalasConferencia] = useState([
    { id: 1, nome: 'Sala de Conferência 1' },
    { id: 2, nome: 'Sala de Conferência 2' },
  ]);

  const [novoRecurso, setNovoRecurso] = useState({
    tipo: '',
    nome: '',
    placa: '',
  });

  const handleAdicionarRecurso = (e) => {
    e.preventDefault();
    if (novoRecurso.tipo === 'auditorio') {
      setAuditorios([...auditorios, { id: auditorios.length + 1, nome: novoRecurso.nome }]);
    } else if (novoRecurso.tipo === 'veiculo') {
      setVeiculos([...veiculos, { id: veiculos.length + 1, placa: novoRecurso.placa }]);
    } else if (novoRecurso.tipo === 'salaConferencia') {
      setSalasConferencia([...salasConferencia, { id: salasConferencia.length + 1, nome: novoRecurso.nome }]);
    }
    setNovoRecurso({ tipo: '', nome: '', placa: '' });
  };

  const handleRemoverRecurso = (id, tipo) => {
    if (tipo === 'auditorio') {
      setAuditorios(auditorios.filter((auditorio) => auditorio.id !== id));
    } else if (tipo === 'veiculo') {
      setVeiculos(veiculos.filter((veiculo) => veiculo.id !== id));
    } else if (tipo === 'salaConferencia') {
      setSalasConferencia(salasConferencia.filter((sala) => sala.id !== id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-4">Recursos</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-100 p-4 rounded-md">
          <h2 className="text-2xl font-bold mb-2">Auditórios</h2>
          <ul>
            {auditorios.map((auditorio) => (
              <li key={auditorio.id} className="flex justify-between mb-2">
                <span className="text-lg">{auditorio.nome}</span>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md"
                  onClick={() => handleRemoverRecurso(auditorio.id, 'auditorio')}
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>
          <form onSubmit={handleAdicionarRecurso}>
            <input
              type="text"
              value={novoRecurso.nome}
              onChange={(e) => setNovoRecurso({ ...novoRecurso, nome: e.target.value })}
              placeholder="Nome do auditório"
              className="w-full p-2 mb-2 border border-gray-300 rounded-md"
            />
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md"
            >
              Adicionar
            </button>
          </form>
        </div>
        <div className="bg-gray-100 p-4 rounded-md">
          <h2 className="text-2xl font-bold mb-2">Veículos</h2>
          <ul>
            {veiculos.map((veiculo) => (
              <li key={veiculo.id} className="flex justify-between mb-2">
                <span className="text-lg">{veiculo.placa}</span>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md"
                  onClick={() => handleRemoverRecurso(veiculo.id, 'veiculo')}
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>
            <form onSubmit={handleAdicionarRecurso}>
            <input
              type="text"
              value={novoRecurso.placa}
              onChange={(e) => setNovoRecurso({ ...novoRecurso, placa: e.target.value })}
              placeholder="Placa do veículo"
              className="w-full p-2 mb-2 border border-gray-300 rounded-md"
            />
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md"
            >
              Adicionar
            </button>
          </form>
          </div>
          <div className="bg-gray-100 p-4 rounded-md">
            <h2 className="text-2xl font-bold mb-2">Salas de Conferência</h2>
            <ul>
              {salasConferencia.map((sala) => (
                <li key={sala.id} className="flex justify-between mb-2">
                  <span className="text-lg">{sala.nome}</span>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md"
                    onClick={() => handleRemoverRecurso(sala.id, 'salaConferencia')}
                  >
                    Remover
                  </button>
                </li>
              ))}
            </ul>
            <form onSubmit={handleAdicionarRecurso}>
              <input
                type="text"
                value={novoRecurso.nome}
                onChange={(e) => setNovoRecurso({ ...novoRecurso, nome: e.target.value })}
                placeholder="Nome da sala de conferência"
                className="w-full p-2 mb-2 border border-gray-300 rounded-md"
              />
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md"
              >
                Adicionar
              </button>
            </form>
          </div>
          </div>
          </div>
          );
          }
          
          export default AdminRecursos;