import React from 'react';

function AdminUsuarios() {
  const usuarios = [
    {
      id: 1,
      nome: 'João Silva',
      email: 'joao.silva@example.com',
      siap: '123456789',
      cpf: '123.456.789-00',
      status: 'Pendente',
    },
    {
      id: 2,
      nome: 'Maria Oliveira',
      email: 'maria.oliveira@example.com',
      siap: '987654321',
      cpf: '987.654.321-00',
      status: 'Pendente',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-4">Usuários Pendentes</h1>
      {usuarios.map((usuario) => (
        <div key={usuario.id} className="bg-white shadow-md rounded-md p-4 mb-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-100 p-4 rounded-md">
              <h2 className="text-2xl font-bold mb-2">Usuário {usuario.id}</h2>
              <div className="flex flex-col">
                <div className="flex justify-between mb-2">
                  <span className="text-lg font-bold">Nome:</span>
                  <span className="text-lg">{usuario.nome}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-lg font-bold">Email:</span>
                  <span className="text-lg">{usuario.email}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-lg font-bold">SIAP:</span>
                  <span className="text-lg">{usuario.siap}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-lg font-bold">CPF:</span>
                  <span className="text-lg">{usuario.cpf}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-lg font-bold">Status:</span>
                  <span className="text-lg">{usuario.status}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md mr-2">Aceitar</button>
              <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md">Recusar</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AdminUsuarios;