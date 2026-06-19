import api from './api';

export const createShop = async (shopData) => {
  const response = await api.post('/shop', shopData);
  return response.data;
};

export const getMyShop = async () => {
  const response = await api.get('/shop/my-shop');
  return response.data;
};

export const updateShop = async (id, shopData) => {
  const response = await api.put(`/shop/${id}`, shopData);
  return response.data;
};

export const getShopBySlug = async (slug) => {
  const response = await api.get(`/shop/slug/${slug}`);
  return response.data;
};
