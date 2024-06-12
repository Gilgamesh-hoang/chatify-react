// socketSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { userInitState, UserState } from './userSlice';
import { SocketEvent } from '~/model/SocketEvent';
export type StatusSocket = 'connecting' | 'open' | 'closed' | 'error';
export interface SocketState {
  socket: WebSocket | null;
  statusSocket : StatusSocket;
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
      console.log(' connected')
    },
    socketDisconnect: (state) => {
      if (state.socket) {
        state.socket.close();
      }
      state.socket = null;
      console.log('disconnected')
    },
    socketSendMessage: (state, action: PayloadAction<SocketEvent>) => {
<<<<<<< HEAD
      console.log('send message', action.payload);
      
      state.socket?.send(JSON.stringify(action));
=======
      state.socket?.send(JSON.stringify(action.payload));
>>>>>>> e120e69b8bbc34ee0e069a92b43470283fe996c2
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
