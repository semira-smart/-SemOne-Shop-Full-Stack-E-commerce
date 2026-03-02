// frontend/src/services/productService.js
import api from './api';

export const productService = {
  getAllProducts: async (page = 1, limit = 10, search = '') => {
    if (search && search.trim()) {
      const q = encodeURIComponent(search.trim());
      return await api.get(`/products/search?q=${q}`);
    }
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    return await api.get(`/products?${params.toString()}`);
  },

  getProductById: async (id) => {
    return await api.get(`/products/${id}`);
  },

  createProduct: async (productData, token) => {
    return await api.post('/products', productData, token);
  },

  updateProduct: async (id, productData, token) => {
    return await api.put(`/products/${id}`, productData, token);
  },

  deleteProduct: async (id, token) => {
    return await api.delete(`/products/${id}`, token);
  },
};
