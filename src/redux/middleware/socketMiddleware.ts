// websocketMiddleware.ts
import { Middleware } from '@reduxjs/toolkit';
import { setupWebSocket } from '~/utils/socket';
import { socketConnect, socketDisconnect } from '../socketSlice';

let socket: WebSocket | null = null;

const websocketMiddleware: Middleware = ({ dispatch }) => (next) => (action) => {
  if (socketConnect.match(action)) {
    if (socket) {
      socket.close();
    }
    socket = setupWebSocket(dispatch);
    action.payload = socket
  }
  if (socketDisconnect.match(action)) {
    if (socket) {
      socket.close();
      socket = null;
      dispatch(socketDisconnect());
    }
  }

  next(action);
};

export default websocketMiddleware;
