import axios from 'axios';

const api = axios.create({
  baseURL: 'https://testcraft-production.up.railway.app',
  timeout: 15000,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('student_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
