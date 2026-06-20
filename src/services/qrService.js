import api from './api';

export const trackQRScan = async (shopId) => {
  try {
    const { data } = await api.post('/qr/scan', { shopId, source: 'QR' });
    return data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getQRAnalytics = async (shopId) => {
  try {
    const { data } = await api.get(`/qr/analytics/${shopId}`);
    return data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
