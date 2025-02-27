import React, { useState, useEffect } from "react";

const resourceTranslations = {
    "auditorium": "Auditório",
    "meeting_room": "Sala de Reunião",
    "vehicle": "Veículo"
};

// Função para gerar opções de horários válidos (07:00 - 23:30, com intervalos de 30min)
const generateTimeOptions = () => {
    const options = [];
    for (let hour = 7; hour < 24; hour++) {
        options.push(`${String(hour).padStart(2, "0")}:00`);
        options.push(`${String(hour).padStart(2, "0")}:30`);
    }
    return options;
};

const CreateReservation = () => {
    const [form, setForm] = useState({
        resourceType: "",
        resourceId: "",
        initial_date: "",
        final_date: "",
        initial_time: "",
        final_time: "",
        description: ""
    });

    const [resources, setResources] = useState([]);
    const [message, setMessage] = useState("");
    const timeOptions = generateTimeOptions();

    // Obtém a data mínima permitida (2 dias a partir de hoje)
    const getMinDate = () => {
        const today = new Date();
        today.setDate(today.getDate() + 2);
        return today.toISOString().split("T")[0]; // Formato YYYY-MM-DD
    };

    // Carrega os recursos disponíveis ao selecionar um tipo
    useEffect(() => {
        if (form.resourceType) {
            fetch(`http://127.0.0.1:8000/api/${form.resourceType}/`)
                .then((res) => res.json())
                .then((data) => setResources(data))
                .catch(() => setMessage("Erro ao carregar os recursos."));
        }
    }, [form.resourceType]);

    // Atualiza os campos do formulário
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Validação de datas
        if ((name === "initial_date" || name === "final_date") && value < getMinDate()) {
            setMessage("As reservas devem ser feitas com pelo menos 2 dias de antecedência.");
            return;
        }

        // Validação de horários
        if (name === "final_time" && form.initial_time && value <= form.initial_time) {
            setMessage("O horário final deve ser maior que o inicial.");
            return;
        }

        setMessage(""); // Limpa mensagens de erro se tudo estiver certo
        setForm({ ...form, [name]: value });
    };

    // Enviar reserva
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!form.resourceType || !form.resourceId) {
            setMessage("Por favor, selecione um recurso.");
            return;
        }

        const reservationData = {
            [form.resourceType]: form.resourceId,
            initial_date: form.initial_date,
            final_date: form.final_date,
            initial_time: form.initial_time,
            final_time: form.final_time,
            description: form.description
        };

        fetch("http://127.0.0.1:8000/api/reservations/create/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(reservationData)
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.id) {
                setMessage("Reserva criada com sucesso!");
                setForm({
                    resourceType: "",
                    resourceId: "",
                    initial_date: "",
                    final_date: "",
                    initial_time: "",
                    final_time: "",
                    description: ""
                });
            } else {
                setMessage("Erro ao criar a reserva. Verifique os dados.");
            }
        })
        .catch(() => setMessage("Erro ao enviar a solicitação."));
    };

    return (
        <div>
            <h2>Fazer Reserva</h2>

            <form onSubmit={handleSubmit}>
                {/* Seleção do tipo de recurso */}
                <label>Selecione um Recurso:</label>
                <select name="resourceType" value={form.resourceType} onChange={handleChange}>
                    <option value="">Selecione</option>
                    {Object.keys(resourceTranslations).map((key) => (
                        <option key={key} value={key}>
                            {resourceTranslations[key]}
                        </option>
                    ))}
                </select>

                {/* Seleção do recurso específico */}
                {resources.length > 0 && (
                    <>
                        <label>Escolha um {resourceTranslations[form.resourceType]}:</label>
                        <select name="resourceId" value={form.resourceId} onChange={handleChange}>
                            <option value="">Selecione</option>
                            {resources.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.nome}
                                </option>
                            ))}
                        </select>
                    </>
                )}

                {/* Datas */}
                <label>Data Inicial:</label>
                <input 
                    type="date" 
                    name="initial_date" 
                    value={form.initial_date} 
                    onChange={handleChange} 
                    min={getMinDate()} 
                    required 
                />

                <label>Data Final:</label>
                <input 
                    type="date" 
                    name="final_date" 
                    value={form.final_date} 
                    onChange={handleChange} 
                    min={form.initial_date || getMinDate()} 
                    required 
                />

                {/* Horários */}
                <label>Hora Inicial:</label>
                <select name="initial_time" value={form.initial_time} onChange={handleChange} required>
                    <option value="">Selecione</option>
                    {timeOptions.map((time) => (
                        <option key={time} value={time}>
                            {time}
                        </option>
                    ))}
                </select>

                <label>Hora Final:</label>
                <select name="final_time" value={form.final_time} onChange={handleChange} required>
                    <option value="">Selecione</option>
                    {timeOptions
                        .filter((time) => !form.initial_time || time > form.initial_time) // Impede horários inválidos
                        .map((time) => (
                            <option key={time} value={time}>
                                {time}
                            </option>
                        ))}
                </select>

                {/* Descrição */}
                <label>Descrição:</label>
                <textarea name="description" value={form.description} onChange={handleChange} required />

                {message && <p style={{ color: "red" }}>{message}</p>}
                
                {/* Botão de envio */}
                <button type="submit">Reservar</button>
            </form>
        </div>
    );
};

export default CreateReservation;
