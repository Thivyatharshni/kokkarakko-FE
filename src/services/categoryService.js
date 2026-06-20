import api from './api';

export const getCategoriesBySlug = async (slug) => {
  try {
    const { data } = await api.get(`/categories/${slug}`);
    return data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createCategory = async (categoryData) => {
  try {
    const { data } = await api.post('/categories', categoryData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateCategory = async (id, categoryData) => {
  try {
    const { data } = await api.put(`/categories/${id}`, categoryData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteCategory = async (id) => {
  try {
    const { data } = await api.delete(`/categories/${id}`);
    return data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
