// socketSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { userInitState, UserState } from './userSlice';
import { SocketEvent } from '~/model/SocketEvent';

export interface SocketState {
  socket: WebSocket | null;
  statusSocket : 'connecting' | 'open' | 'closed' | 'error';
  user: UserState;
}

export const socketInitState: SocketState = {
  user: userInitState,
  socket: null,
  statusSocket : 'closed'
};

export const socketSlice = createSlice({
  name: 'socket',
  initialState: socketInitState,
  reducers: {
    socketConnect: (state,action :PayloadAction<WebSocket | null>) => {
      state.socket = action.payload
    },
    socketDisconnect: (state) => {
      if (state.socket) {
        state.socket.close();
      }
      state.socket = null;
    },
    socketSendMessage: (state, action: PayloadAction<SocketEvent>) => {
      state.socket?.send(JSON.stringify(action.payload));
    },
    socketReceiveMessage: (state, action: PayloadAction<any>) => {
      // Handle received message
      console.log('Message received:', action.payload);
    },
  },
});

export const {
  socketConnect,
  socketDisconnect,
  socketSendMessage,
  socketReceiveMessage,
} = socketSlice.actions;

export default socketSlice.reducer;
