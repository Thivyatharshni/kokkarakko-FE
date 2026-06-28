import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env variables from root/client directory
  const env = loadEnv(mode, process.cwd(), '');
  const apiUrl = env.VITE_API_URL;
  
  if (!apiUrl) {
    throw new Error('VITE_API_URL environment variable is required to start Vite development server.');
  }
  
  const target = apiUrl.replace('/api', '');

  return {
    plugins: [react()],
    server: {
      host: true,
      allowedHosts: true,
      port: 5173,
      proxy: {
        '/api': {
          target,
          changeOrigin: true,
        },
        '/uploads': {
          target,
          changeOrigin: true,
        },
        '/socket.io': {
          target,
          ws: true,
          changeOrigin: true,
        },
      },
    },
  };
});
