import React, { useState, useEffect } from "react";

const resourceTranslations = {
    "auditorium": "Auditório",
    "meeting_room": "Sala de Reunião",
    "vehicle": "Veículo"
};

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

    const getMinDate = () => {
        const today = new Date();
        today.setDate(today.getDate() + 2);
        return today.toISOString().split("T")[0];
    };

    useEffect(() => {
        if (form.resourceType) {
            fetch(`http://127.0.0.1:8000/api/${form.resourceType}/`)
                .then((res) => res.json())
                .then((data) => setResources(data))
                .catch(() => setMessage("Erro ao carregar os recursos."));
        }
    }, [form.resourceType]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMessage("");
        setForm({ ...form, [name]: value });
    };

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
            <div className="border-2 border-gray-300 rounded-lg p-6 w-1/2 items-center">
                <h2 className="text-2xl font-bold text-center mb-4">Solicitação de Reserva</h2>
                <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
                    <label className="font-bold flex items-center gap-4 mb-4">
                        Selecione o tipo de reserva:
                        <select name="resourceType" value={form.resourceType} onChange={handleChange} className="border-2 border-gray-300 rounded-lg p-2 font-normal">
                            <option value="">Selecione</option>
                            {Object.keys(resourceTranslations).map((key) => (
                                <option key={key} value={key}>{resourceTranslations[key]}</option>
                            ))}
                        </select>
                    </label>
                    {resources.length > 0 && (
                        <label className="font-bold">Escolha um recurso:
                            <select name="resourceId" value={form.resourceId} onChange={handleChange} className="border-2 border-gray-300 rounded-lg p-2">
                                <option value="">Selecione</option>
                                {resources.map((item) => (
                                    <option key={item.id} value={item.id}>{item.nome}</option>
                                ))}
                            </select>
                        </label>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-4">
                            <label htmlFor="data-inicial" className="font-bold">Data inicial:</label>
                            <input type="date" id="data-inicial" name="data_inicial" value={form.initial_date} onChange={handleChange} min={getMinDate()} required className="border-2 border-gray-300 rounded-lg p-2" />

                            <label htmlFor="horario-inicial" className="font-bold">Horário inicial:</label>
                            <input type="time" id="horario-inicial" name="horario_inicial" value={form.initial_time} onChange={handleChange} required className="border-2 border-gray-300 rounded-lg p-2" />
                        </div>
                        <div className="flex flex-col gap-4">
                            <label htmlFor="data-final" className="font-bold">Data final:</label>
                            <input type="date" id="data-final" name="data_final" value={form.final_date} onChange={handleChange} min={form.initial_date || getMinDate()} required className="border-2 border-gray-300 rounded-lg p-2" />

                            <label htmlFor="horario-final" className="font-bold">Horário final:</label>
                            <input type="time" id="horario-final" name="horario_final" value={form.final_time} onChange={handleChange} required className="border-2 border-gray-300 rounded-lg p-2" />
                        </div>
                    </div>
                    <label className="font-bold">Descrição:
                        <textarea name="description" value={form.description} onChange={handleChange} required className="border-2 border-gray-300 rounded-lg p-2"></textarea>
                    </label>
                    {message && <p className="text-red-600">{message}</p>}
                    <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg self-center">Reservar</button>
                </form>
            </div>
    );
};

export default CreateReservation;