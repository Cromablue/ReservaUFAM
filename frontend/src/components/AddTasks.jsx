import React, { useState } from 'react';

function    AddTasks({onAddTaskSubmite}) {
    const [title, setTitle] =useState('')
    const [description, setDescription] = useState('')
    return (
            <div className="space-y-4 p-6 bg-slate-200 rounded-md shadow flex flex-col">
                <input 
                    type="text" 
                    placeholder="Adicione uma Reserva" 
                    className="border border-slate-300 outline-slate-400 px-4 py-2 rounded-md" 
                    value={title} 
                    onChange={(event) => setTitle(event.target.value)}>
                </input>

                <input 
                    type="text" 
                    placeholder="Digite a descrição da reserva" 
                    className="border border-slate-300 outline-slate-400 px-4 py-2 rounded-md" 
                    value={description} 
                    onChange={(event) => setDescription(event.target.value)}>
                </input>

                <button  onClick={() => {
                        if(!title.trim() || !description.trim()) return alert('Preencha todos os campos')
                        onAddTaskSubmite(title, description)
                        setTitle('')
                        setDescription('')}
                }
                className="bg-slate-500 p-2 text-white px-4 py-2 rounded-md font-medium">Adicionar
                </button>

            </div> 
    )
}
export default AddTasks