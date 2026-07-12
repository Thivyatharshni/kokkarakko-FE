const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) {
    throw new Error('VITE_API_URL is required but not defined in environment variables');
  }
  return envUrl;
};

const getSocketUrl = () => {
  const envUrl = import.meta.env.VITE_SOCKET_URL;
  const apiUrl = import.meta.env.VITE_API_URL;
  
  // If we are on production, but envUrl is localhost/missing, resolve dynamically from the API URL origin
  const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
  if (isProduction) {
    if (!envUrl || envUrl.includes('localhost') || envUrl.includes('127.0.0.1')) {
      if (apiUrl) {
        try {
          const url = new URL(apiUrl);
          return url.origin;
        } catch (e) {
          console.error('Failed to parse VITE_API_URL for socket fallback:', e);
        }
      }
    }
  }
  
  return envUrl || 'http://localhost:5001';
};

const getImageUrl = () => {
  const envUrl = import.meta.env.VITE_IMAGE_URL;
  if (!envUrl) {
    throw new Error('VITE_IMAGE_URL is required but not defined in environment variables');
  }
  return envUrl;
};

export const API_BASE_URL = getApiBaseUrl();
export const SOCKET_URL = getSocketUrl();
export const IMAGE_BASE_URL = getImageUrl();

export const getFullImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  return `${IMAGE_BASE_URL}${imagePath}`;
};
