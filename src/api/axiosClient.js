import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8081/api/v1',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tm_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('tm_token');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export default api;