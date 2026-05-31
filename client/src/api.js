import axios from 'axios';

const api = axios.create({
  baseURL: 'https://testcraft-production.up.railway.app',
  timeout: 15000,
});

export default api;
