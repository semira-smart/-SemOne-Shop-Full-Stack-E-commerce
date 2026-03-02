// frontend/src/services/api.js

const isDev = import.meta.env.DEV;
const API_BASE_URL = isDev ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:5001');

/**
 * Generic API client with automatic token injection
 * Handles all HTTP methods (GET, POST, PUT, DELETE)
 */
const api = {
  /**
   * GET request - Fetch data from server
   * @param {string} endpoint - API endpoint (e.g., '/products')
   * @param {string|null} token - JWT token for authentication (optional)
   * @returns {Promise} - JSON response from server
   */
  get: async (endpoint, token = null) => {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // Add Authorization header if token is provided
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers,
    });
    
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`GET ${endpoint} failed: ${response.status} ${text}`);
    }
    return response.json();
  },

  /**
   * POST request - Create new resource
   * @param {string} endpoint - API endpoint
   * @param {object} data - Data to send in request body
   * @param {string|null} token - JWT token for authentication (optional)
   * @returns {Promise} - JSON response from server
   */
  post: async (endpoint, data, token = null) => {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // Add Authorization header if token is provided
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data), // Convert object to JSON string
    });
    
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`POST ${endpoint} failed: ${response.status} ${text}`);
    }
    return response.json();
  },

  /**
   * PUT request - Update existing resource
   * @param {string} endpoint - API endpoint
   * @param {object} data - Updated data
   * @param {string|null} token - JWT token for authentication (optional)
   * @returns {Promise} - JSON response from server
   */
  put: async (endpoint, data, token = null) => {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`PUT ${endpoint} failed: ${response.status} ${text}`);
    }
    return response.json();
  },

  /**
   * DELETE request - Remove resource
   * @param {string} endpoint - API endpoint
   * @param {string|null} token - JWT token for authentication (optional)
   * @returns {Promise} - JSON response from server
   */
  delete: async (endpoint, token = null) => {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers,
    });
    
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`DELETE ${endpoint} failed: ${response.status} ${text}`);
    }
    return response.json();
  },
};

// Export as default so services can import it easily
export default api;
