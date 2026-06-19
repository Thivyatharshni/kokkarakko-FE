import api from './api';

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  if (response.data.data.token) {
    localStorage.setItem('adminToken', response.data.data.token);
  }
  return response.data;
};

export const register = async (name, email, password) => {
  const response = await api.post('/auth/register', { name, email, password });
  if (response.data.data.token) {
    localStorage.setItem('adminToken', response.data.data.token);
  }
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('adminToken');
};
