import axios from 'axios';

export const USER_ID = Number(import.meta.env.VITE_USER_ID || 1);
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api',
  headers: { 'Content-Type': 'application/json' },
});

export const endpoints = {
  user: () => api.get(`/users/${USER_ID}`),
  updateUser: (data) => api.put(`/users/${USER_ID}`, data),
  categories: () => api.get('/categories', { params: { userId: USER_ID } }),
  createCategory: (data) => api.post('/categories', { ...data, userId: USER_ID }),
  updateCategory: (id, data) => api.put(`/categories/${id}`, { ...data, userId: USER_ID }),
  deleteCategory: (id) => api.delete(`/categories/${id}`, { params: { userId: USER_ID } }),
  transactions: (params = {}) => api.get('/transactions', { params: { userId: USER_ID, page: 0, size: 10, sortBy: 'date', direction: 'DESC', ...params } }),
  createTransaction: (data) => api.post('/transactions', { ...data, userId: USER_ID }),
  updateTransaction: (id, data) => api.put(`/transactions/${id}`, { ...data, userId: USER_ID }),
  deleteTransaction: (id) => api.delete(`/transactions/${id}`, { params: { userId: USER_ID } }),
  budgets: (params = {}) => api.get('/budgets', { params: { userId: USER_ID, ...params } }),
  createBudget: (data) => api.post('/budgets', { ...data, userId: USER_ID }),
  updateBudget: (id, data) => api.put(`/budgets/${id}`, { ...data, userId: USER_ID }),
  deleteBudget: (id) => api.delete(`/budgets/${id}`, { params: { userId: USER_ID } }),
  dashboard: (month, year) => api.get('/dashboard/summary', { params: { userId: USER_ID, month, year } }),
};

export function errorMessage(error) {
  const data = error?.response?.data;
  if (typeof data === 'string') return data;
  if (data?.message) return data.message;
  if (data?.errors) return Object.values(data.errors).join(', ');
  if (error?.message === 'Network Error') return 'Cannot reach the backend. Check that Spring Boot is running on port 8081.';
  return error?.message || 'Something went wrong. Please try again.';
}
