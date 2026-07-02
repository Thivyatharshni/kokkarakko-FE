import api from './api';

export const createOrder = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

export const getLiveOrders = async (shopId) => {
  const response = await api.get(`/orders/live/${shopId}`);
  return response.data;
};

export const getHistoryOrders = async (shopId, params = {}) => {
  const response = await api.get(`/orders/history/${shopId}`, { params });
  return response.data;
};

export const updateOrderStatus = async (id, status) => {
  const response = await api.put(`/orders/${id}/status`, { status });
  return response.data;
};

export const verifyOrderCancellation = async (orderNumber, customerMobile) => {
  const response = await api.post('/orders/verify-cancellation', { orderNumber, customerMobile });
  return response.data;
};

export const cancelOrder = async (orderNumber, customerMobile) => {
  const response = await api.post('/orders/cancel', { orderNumber, customerMobile });
  return response.data;
};
