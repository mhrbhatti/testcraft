import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000, // 30s for puppeteer PDF generation
});

export default api;
