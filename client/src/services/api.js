import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const register = (email, password, name) =>
  api.post('/auth/register', { email, password, name });

export const login = (email, password) =>
  api.post('/auth/login', { email, password });

// Notes
export const getAllNotes = () => api.get('/notes');

export const getNote = (id) => api.get(`/notes/${id}`);

export const createNote = (title, content, tags) =>
  api.post('/notes', { title, content, tags });

export const updateNote = (id, title, content, tags) =>
  api.put(`/notes/${id}`, { title, content, tags });

export const deleteNote = (id) => api.delete(`/notes/${id}`);

export const generateSummary = (id) =>
  api.post(`/notes/${id}/generate-summary`);

export const generateTitle = (content) =>
  api.post('/notes/generate-title', { content });

export const searchNotes = (query) =>
  api.get(`/notes/search/query?q=${encodeURIComponent(query)}`);

export default api;
