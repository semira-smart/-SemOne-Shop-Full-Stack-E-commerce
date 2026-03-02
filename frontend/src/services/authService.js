// frontend/src/services/authService.js
import api from './api';

export const authService = {
  register: async (userData) => {
    return await api.post('/auth/register', userData);
  },

  login: async (email, password) => {
    return await api.post('/auth/login', { email, password });
  },
};