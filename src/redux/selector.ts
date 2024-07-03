import { StatusSocket } from './socketSlice';
import { RootState } from './store';
import { UserState } from './userSlice';
import { ChatData } from '~/redux/chatDataSlice';

export const userSelector = (state: RootState): UserState => state.app.user!;
export const socketSelector = (state: RootState): WebSocket =>
    state.app.socket.socket!;
export const socketStatusSelector = (state: RootState): StatusSocket =>
    state.app.socket.statusSocket!;
export const chatDataSelector = (state: RootState):ChatData  => {
  return state.app.chatData!;
};