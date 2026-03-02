// frontend/src/services/orderService.js
import api from './api';

export const orderService = {
  createOrder: async (orderData, token) => {
    return await api.post('/orders', orderData, token);
  },

  getUserOrders: async (token) => {
    return await api.get('/orders/myorders', token);
  },

  getAllOrders: async (token) => {
    return await api.get('/orders', token);
  },

  updateOrderStatus: async (id, status, token) => {
    return await api.put(`/orders/${id}/status`, { status }, token);
  },
};