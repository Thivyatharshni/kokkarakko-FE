import { io } from 'socket.io-client';
import { SOCKET_URL } from '../config/constants';

const getTransports = () => {
  const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
  if (isProduction) {
    return ['polling']; // Force polling in production to prevent proxy upgrade failure loops
  }
  return ['polling', 'websocket'];
};

const socket = io(SOCKET_URL, {
  autoConnect: false, // We'll connect manually when needed
  transports: getTransports(),
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
});

export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

export default socket;
