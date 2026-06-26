const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
  const isLocalhostEnv = envUrl.includes('localhost') || envUrl.includes('127.0.0.1');
  const isCurrentHostRemote = !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1');
  
  if (isLocalhostEnv && isCurrentHostRemote) {
    return `${window.location.origin}/api`;
  }
  return envUrl;
};

const getSocketUrl = () => {
  const envUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';
  const isLocalhostEnv = envUrl.includes('localhost') || envUrl.includes('127.0.0.1');
  const isCurrentHostRemote = !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1');
  
  if (isLocalhostEnv && isCurrentHostRemote) {
    return window.location.origin;
  }
  return envUrl;
};

const getImageUrl = () => {
  const envUrl = import.meta.env.VITE_IMAGE_URL || 'http://localhost:5001';
  const isLocalhostEnv = envUrl.includes('localhost') || envUrl.includes('127.0.0.1');
  const isCurrentHostRemote = !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1');
  
  if (isLocalhostEnv && isCurrentHostRemote) {
    return window.location.origin;
  }
  return envUrl;
};

export const API_BASE_URL = getApiBaseUrl();
export const SOCKET_URL = getSocketUrl();
export const IMAGE_BASE_URL = getImageUrl();
