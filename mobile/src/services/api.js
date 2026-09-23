import axios from 'axios';
import { Platform } from 'react-native';

// On physical mobile device over Wi-Fi, connect to computer's local IP (10.20.18.138)
const getDefaultBaseUrl = () => {
  if (Platform.OS === 'web') {
    return 'http://localhost:5000/api/v1';
  }
  return 'http://10.20.18.138:5000/api/v1';
};

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || getDefaultBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getCompetitionDetails = async (id = 'classical-dance-2026', token = null) => {
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const response = await api.get(`/competitions/${id}`, { headers });
  return response.data.data;
};

export const registerForCompetition = async (id, token) => {
  const headers = { Authorization: `Bearer ${token}` };
  const response = await api.post(`/competitions/${id}/register`, {}, { headers });
  return response.data;
};

export const submitEntry = async (id, payload, token) => {
  const headers = { Authorization: `Bearer ${token}` };
  const response = await api.post(`/competitions/${id}/submission`, payload, { headers });
  return response.data;
};

export const listAllCompetitions = async () => {
  const response = await api.get('/competitions');
  return response.data.data;
};

export const registerUser = async (name, email, password) => {
  const response = await api.post('/auth/register', { name, email, password });
  return response.data.data;
};

export const getCurrentUser = async (token) => {
  const headers = { Authorization: `Bearer ${token}` };
  const response = await api.get('/auth/me', { headers });
  return response.data.data.user;
};

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data.data;
};

export const getDemoUsers = async () => {
  const response = await api.get('/auth/demo-users');
  return response.data.data;
};

export const resetRegistration = async (id, token) => {
  const headers = { Authorization: `Bearer ${token}` };
  const response = await api.post(`/competitions/${id}/reset-demo`, {}, { headers });
  return response.data;
};

export default api;
