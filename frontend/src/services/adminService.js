// frontend/src/services/adminService.js
import api from './api';

export const adminService = {
  registerAdmin: async (data, token) => {
    return await api.post('/admin/register', data, token);
  },
};
