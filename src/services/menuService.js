import api from './api';

export const createMenuItem = async (formData) => {
  const response = await api.post('/menu', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const getMenuBySlug = async (slug) => {
  const response = await api.get(`/menu/${slug}`);
  return response.data;
};

export const updateMenuItem = async (id, formData) => {
  const response = await api.put(`/menu/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteMenuItem = async (id) => {
  const response = await api.delete(`/menu/${id}`);
  return response.data;
};

export const getFeaturedMenuBySlug = async (slug) => {
  const response = await api.get(`/menu/featured/${slug}`);
  return response.data;
};
