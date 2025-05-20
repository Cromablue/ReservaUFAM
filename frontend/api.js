import axios from "axios";

const api = axios.create({
  baseURL: "http://reservaufam.lab.local:8000", // base do backend Django
  // ou, se preferir usar variável de ambiente:
  // baseURL: import.meta.env.VITE_API_URL || "http://reservaufam.lab.local:8000",
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
