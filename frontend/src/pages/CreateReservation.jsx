import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BackButton from "../components/BackButton";
import MessagePopup from "../components/MessagePopup";
import api from "../api";

const resourceTranslations = {
    "auditorium": "Auditório",
    "meeting_room": "Sala de Reunião",
    "vehicle": "Veículo"
};

const generateTimeOptions = () => {
    const options = [];
    for (let hour = 7; hour < 23; hour++) {
        const formattedHour = hour.toString().padStart(2, '0');
        options.push(`${formattedHour}:00`);
        options.push(`${formattedHour}:30`);
    }
    return options;
};

const getFinalTimeOptions = (initialTime, initialDate, finalDate) => {
    if (!initialTime || !initialDate || !finalDate) return [];
    const initialDateObj = new Date(initialDate);
    const finalDateObj = new Date(finalDate);
    if (initialDateObj.getTime() !== finalDateObj.getTime()) {
        return generateTimeOptions();
    }
    const allOptions = generateTimeOptions();
    const initialTimeIndex = allOptions.findIndex(time => time === initialTime);
    if (initialTimeIndex === -1) return [];
    return allOptions.slice(initialTimeIndex + 1);
};

const CreateReservation = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });
    const [resources, setResources] = useState({
        auditorium: [],
        meeting_room: [],
        vehicle: []
    });
    const [occupiedDates, setOccupiedDates] = useState([]);
    const [selectedResource, setSelectedResource] = useState(null);

    const [formModified, setFormModified] = useState(false);
    const [initialFormData] = useState({
        resource_type: "",
        resource_id: "",
        initial_date: "",
        final_date: "",
        initial_time: "",
        final_time: "",
        description: ""
    });

    const [formData, setFormData] = useState({
        resource_type: "",
        resource_id: "",
        initial_date: "",
        final_date: "",
        initial_time: "",
        final_time: "",
        description: ""
    });

    const timeOptions = generateTimeOptions();

    const getMinDate = () => {
        const today = new Date();
        today.setDate(today.getDate() + 2);
        return today.toISOString().split("T")[0];
    };

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
            return;
        }
        fetchResources();
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        if (formData.resource_type && formData.resource_id) {
            fetchOccupiedDates();
        }
    }, [formData.resource_type, formData.resource_id]);

    const handleError = (errorMessage) => {
        setMessage({ text: errorMessage, type: 'error' });
    };

    const handleSuccess = (successMessage) => {
        setMessage({ text: successMessage, type: 'success' });
    };

    const clearMessage = () => {
        setMessage({ text: "", type: "" });
    };

    const fetchResources = async () => {
        try {
            const [auditoriumResponse, meetingRoomResponse, vehicleResponse] = await Promise.all([
                api.get('/api/resources/auditoriums/'),
                api.get('/api/resources/meeting-rooms/'),
                api.get('/api/resources/vehicles/')
            ]);
            setResources({
                auditorium: auditoriumResponse.data,
                meeting_room: meetingRoomResponse.data,
                vehicle: vehicleResponse.data
            });
        } catch (error) {
            console.error('Erro ao carregar recursos:', error);
            handleError("Erro ao carregar recursos disponíveis. Por favor, tente novamente mais tarde.");
        }
    };

    const fetchOccupiedDates = async () => {
        try {
            const response = await api.get(`/api/resources/occupied-dates/${formData.resource_type}/${formData.resource_id}/`);
            setOccupiedDates(response.data);
        } catch (error) {
            console.error('Erro ao carregar datas ocupadas:', error);
            handleError("Erro ao carregar disponibilidade do recurso");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newFormData = { ...formData, [name]: value };

        if (name === 'initial_date' || name === 'final_date') {
            newFormData.final_time = '';
            newFormData.initial_time = '';
        }
        if (name === 'initial_time') {
            newFormData.final_time = '';
        }
        if (name === 'initial_date' && newFormData.final_date < value) {
            newFormData.final_date = value;
            newFormData.final_time = '';
        }

        setFormData(newFormData);

        const hasChanges = Object.keys(newFormData).some(
            key => newFormData[key] !== initialFormData[key]
        );
        setFormModified(hasChanges);

        if (name === 'resource_type') {
            setFormData(prev => ({ ...prev, resource_id: '' }));
            setSelectedResource(null);
        }

        if (name === 'resource_id') {
            const resource = resources[formData.resource_type]?.find(r => r.id === parseInt(value));
            setSelectedResource(resource);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formModified) return;

        try {
            if (!formData.resource_type || !formData.resource_id) {
                handleError("Por favor, selecione um recurso.");
                return;
            }
            if (!formData.initial_date || !formData.final_date) {
                handleError("Por favor, selecione as datas inicial e final.");
                return;
            }
            if (!formData.initial_time || !formData.final_time) {
                handleError("Por favor, selecione os horários inicial e final.");
                return;
            }
            if (!formData.description.trim()) {
                handleError("Por favor, forneça uma descrição para a reserva.");
                return;
            }

            const reservationData = {
                initial_date: formData.initial_date,
                final_date: formData.final_date,
                initial_time: formData.initial_time,
                final_time: formData.final_time,
                description: formData.description,
                resource_type: formData.resource_type,
                resource_id: parseInt(formData.resource_id)
            };

            switch (formData.resource_type) {
                case 'auditorium':
                    reservationData.auditorium = parseInt(formData.resource_id);
                    break;
                case 'meeting_room':
                    reservationData.meeting_room = parseInt(formData.resource_id);
                    break;
                case 'vehicle':
                    reservationData.vehicle = parseInt(formData.resource_id);
                    break;
                default:
                    throw new Error('Tipo de recurso inválido');
            }

            const response = await api.post("/api/user/reservations/create/", reservationData);

            if (response.status !== 201 && response.status !== 200) {
                let errorMessage = 'Erro na resposta do servidor';
                if (response.data?.detail) {
                    errorMessage = response.data.detail;
                } else if (typeof response.data === 'object') {
                    const errors = [];
                    Object.entries(response.data).forEach(([key, value]) => {
                        if (Array.isArray(value)) {
                            errors.push(`${key}: ${value.join(', ')}`);
                        } else if (typeof value === 'string') {
                            errors.push(`${key}: ${value}`);
                        }
                    });
                    if (errors.length > 0) {
                        errorMessage = errors.join('. ');
                    }
                }
                throw new Error(errorMessage);
            }

            handleSuccess("Reserva criada com sucesso!");

            setFormData({
                resource_type: "",
                resource_id: "",
                initial_date: "",
                final_date: "",
                initial_time: "",
                final_time: "",
                description: ""
            });
            setFormModified(false);
            setSelectedResource(null);

        } catch (error) {
            console.error('Erro completo:', error);
            handleError(`Erro ao criar reserva: ${error.message}`);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {message.text && (
                <MessagePopup
                    message={message.text}
                    type={message.type}
                    onClose={clearMessage}
                />
            )}
            <BackButton />
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-green-500 to-blue-500 text-transparent bg-clip-text">
                    Solicitar Reserva
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Formulário de Reserva */}
                    <div className="lg:col-span-2">
                        <div className="bg-white p-2 rounded-xl shadow-lg">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Seção de Seleção de Recurso */}
                                <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                        Selecione o Recurso
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                                Tipo de Recurso
                                            </label>
                                            <select
                                                name="resource_type"
                                                value={formData.resource_type}
                                                onChange={handleChange}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 hover:border-green-400"
                                                required
                                            >
                                                <option value="">Selecione um tipo</option>
                                                {Object.entries(resourceTranslations).map(([key, value]) => (
                                                    <option key={key} value={key}>{value}</option>
                                                ))}
                                            </select>
                                        </div>
                                        {formData.resource_type && (
                                            <div>
                                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                                    Recurso Específico
                                                </label>
                                                <select
                                                    name="resource_id"
                                                    value={formData.resource_id}
                                                    onChange={handleChange}
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 hover:border-green-400"
                                                    required
                                                >
                                                    <option value="">Selecione</option>
                                                    {resources[formData.resource_type]?.map(resource => (
                                                        <option key={resource.id} value={resource.id}>
                                                            {resource.name || resource.model}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Seção de Datas e Horários */}
                                <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                        Datas e Horários
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                                Data Inicial
                                            </label>
                                            <input
                                                type="date"
                                                name="initial_date"
                                                min={getMinDate()}
                                                value={formData.initial_date}
                                                onChange={handleChange}
                                                className="w-full p-3 border border-gray-300 rounded-lg"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                                Data Final
                                            </label>
                                            <input
                                                type="date"
                                                name="final_date"
                                                min={formData.initial_date || getMinDate()}
                                                value={formData.final_date}
                                                onChange={handleChange}
                                                className="w-full p-3 border border-gray-300 rounded-lg"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                                Horário Inicial
                                            </label>
                                            <select
                                                name="initial_time"
                                                value={formData.initial_time}
                                                onChange={handleChange}
                                                className="w-full p-3 border border-gray-300 rounded-lg"
                                                required
                                            >
                                                <option value="">Selecione</option>
                                                {timeOptions.map(time => (
                                                    <option key={time} value={time}>{time}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                                Horário Final
                                            </label>
                                            <select
                                                name="final_time"
                                                value={formData.final_time}
                                                onChange={handleChange}
                                                className="w-full p-3 border border-gray-300 rounded-lg"
                                                required
                                            >
                                                <option value="">Selecione</option>
                                                {getFinalTimeOptions(formData.initial_time, formData.initial_date, formData.final_date).map(time => (
                                                    <option key={time} value={time}>{time}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Descrição */}
                                <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Descrição da Reserva
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg"
                                        placeholder="Descreva o motivo da reserva, necessidades especiais etc."
                                        rows={4}
                                        required
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={!formModified}
                                        className={`font-bold py-2 px-4 rounded-lg transition-all duration-300 shadow-md
                                            ${formModified 
                                                ? 'bg-green-500 hover:bg-green-600 text-white hover:shadow-lg cursor-pointer' 
                                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                                    >
                                        Solicitar Reserva
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Ocupação/Disponibilidade */}
                    <div>
                        <div className="bg-white p-4 rounded-xl shadow-lg">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                Datas Ocupadas
                            </h2>
                            {occupiedDates && occupiedDates.length > 0 ? (
                                <ul className="list-disc list-inside text-gray-700">
                                    {occupiedDates.map((date, idx) => (
                                        <li key={idx}>{date}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500">Nenhuma data ocupada para este recurso.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateReservation;
