// socketSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { userInitState, UserState } from './userSlice';
import { SocketEvent } from '~/model/SocketEvent';
<<<<<<< HEAD
=======
import { ChatInfo, initCurrentChat } from '~/redux/currentChatSlice';
>>>>>>> 14c2224ed57af2998bb3bbe07675071c5a32d0f9
export type StatusSocket =
  | 'connecting'
  | 'open'
  | 'closed'
  | 'error'
  | 'sending';
export interface SocketState {
  socket: WebSocket | null;
  statusSocket: StatusSocket;
  user: UserState;
  currentChat: ChatInfo;
}

export const socketInitState: SocketState = {
  user: userInitState,
  socket: null,
  statusSocket: 'closed',
<<<<<<< HEAD
=======
  currentChat: initCurrentChat,
>>>>>>> 14c2224ed57af2998bb3bbe07675071c5a32d0f9
};

export const socketSlice = createSlice({
  name: 'socket',
  initialState: socketInitState,
  reducers: {
    socketConnect: (state, action: PayloadAction<WebSocket | null>) => {
      state.socket = action.payload;
    },
    socketDisconnect: (state) => {
      if (state.socket) {
        state.socket.close();
      }
      state.socket = null;
      state.statusSocket = 'closed';
      console.log('disconnected');
    },
    socketSendMessage: (state, action: PayloadAction<SocketEvent>) => {
      if (state.statusSocket == 'open') {
        console.log('send message ', action.payload);
        state.statusSocket = 'sending';
        state.socket?.send(JSON.stringify(action.payload));
      }
    },
    socketReceivedMessage: (state) => {
      state.statusSocket = 'open';
    },
    socketUpdateStatus: (
      state,
      action: { type: string; payload: StatusSocket }
    ) => {
      state.statusSocket = action.payload;
    },
  },
});

export const {
  socketConnect,
  socketDisconnect,
  socketSendMessage,
  socketReceivedMessage,
  socketUpdateStatus,
} = socketSlice.actions;

export default socketSlice.reducer;
