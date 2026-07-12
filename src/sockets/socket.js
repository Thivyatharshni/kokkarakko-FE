import { io } from 'socket.io-client';
import { SOCKET_URL } from '../config/constants';

const socket = io(SOCKET_URL, {
  autoConnect: false, // We'll connect manually when needed
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
