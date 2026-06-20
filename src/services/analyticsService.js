import api from './api';

export const getShopAnalytics = async (slug) => {
  try {
    const { data } = await api.get(`/analytics/${slug}`);
    return data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getDashboardAnalytics = async (shopId) => {
  try {
    const { data } = await api.get(`/analytics/dashboard/${shopId}`);
    return data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
