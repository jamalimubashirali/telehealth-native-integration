import axios from 'axios';
import { getToken } from '../utils/tokenStorage';

const BASE_URL = 'https://c6zfxs18-5000.inc1.devtunnels.ms';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Helper to get auth headers
const authHeaders = async () => {
  const token = await getToken();
  return { Authorization: `Bearer ${token}` };
};

export const register = async (data) => {
  return api.post('/api/auth/register', data);
};

export const login = async (data) => {
  return api.post('/api/auth/login', data);
};

export const getProfile = async () => {
  return api.get('/api/user/profile', {
    headers: await authHeaders(),
  });
};

export const updateProfile = async (data) => {
  const headers = await authHeaders();
  // Check if data is FormData (for file uploads)
  if (data instanceof FormData) {
    headers['Content-Type'] = 'multipart/form-data';
  } else {
    headers['Content-Type'] = 'application/json';
  }
  return api.put('/api/user/profile', data, {
    headers,
  });
};

export const changePassword = async (data) => {
  return api.put('/api/user/change-password', data, {
    headers: await authHeaders(),
  });
};

export const verifyEmail = async (data) => {
  return api.post('/api/auth/verify-email', data);
};

export const requestPasswordReset = async (data) => {
  return api.post('/api/auth/request-password-reset', data);
};

export const resetPassword = async (data) => {
  return api.post('/api/auth/reset-password', data);
};

export default {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
};
