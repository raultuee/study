// src/api/axiosConfig.ts
import axios from 'axios';

const api = axios.create({
  // A URL base do seu backend
  baseURL: 'https://study-api-k6vt.onrender.com/api',
});

// Isso é um "Interceptor": um código que roda ANTES de cada requisição
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Adiciona o cabeçalho de autorização com o token
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;