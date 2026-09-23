import axios from 'axios';
import { Platform } from 'react-native';

// On Android emulator, localhost is 10.0.2.2. On Web or iOS simulator, localhost is 127.0.0.1.
const getDefaultBaseUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/api/v1';
  }
  return 'http://localhost:5000/api/v1';
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
