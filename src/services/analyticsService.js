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

export const trackProductView = async (shopId, productId, sessionId) => {
  try {
    const { data } = await api.post('/analytics/view', { shopId, productId, sessionId });
    return data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const trackProductViewBatch = async (shopId, productIds, sessionId) => {
  try {
    const { data } = await api.post('/analytics/view/batch', { shopId, productIds, sessionId });
    return data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
