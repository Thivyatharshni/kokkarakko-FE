const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) {
    throw new Error('VITE_API_URL is required but not defined in environment variables');
  }
  return envUrl;
};

const getSocketUrl = () => {
  const envUrl = import.meta.env.VITE_SOCKET_URL;
  if (!envUrl) {
    throw new Error('VITE_SOCKET_URL is required but not defined in environment variables');
  }
  return envUrl;
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
