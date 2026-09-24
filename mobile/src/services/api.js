import axios from 'axios';
import { Platform, NativeModules } from 'react-native';

// Dynamically determine the API base URL
const getBaseUrl = () => {
  // 1. Web browser: Always use localhost to bypass local IP & CORS issues
  if (Platform.OS === 'web') {
    return 'http://localhost:5000/api/v1';
  }

  // 2. Physical Mobile / Emulator: Automatically extract active host IP from Metro scriptURL
  // This automatically updates whenever your computer's Wi-Fi IP changes!
  try {
    const scriptURL = NativeModules?.SourceCode?.scriptURL;
    if (scriptURL) {
      const host = scriptURL.split('://')[1]?.split(':')[0];
      if (host && host !== 'localhost' && host !== '127.0.0.1') {
        return `http://${host}:5000/api/v1`;
      }
    }
  } catch (err) {
    console.warn('Could not auto-detect host IP:', err.message);
  }

  // 3. Fallback to environment variable or active local IP
  return process.env.EXPO_PUBLIC_API_URL || 'http://10.110.156.174:5000/api/v1';
};

export const API_BASE_URL = getBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getCompetitionDetails = async (id = 'classical-dance-2026', token = null, lang = 'en') => {
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const cleanLang = (lang || 'en').toLowerCase();
  const response = await api.get(`/competitions/${id}?lang=${cleanLang}`, { headers });
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

export const listAllCompetitions = async (lang = 'en') => {
  const cleanLang = (lang || 'en').toLowerCase();
  const response = await api.get(`/competitions?lang=${cleanLang}`);
  const payload = response.data?.data;
  return Array.isArray(payload) ? payload : (payload?.competitions || []);
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
