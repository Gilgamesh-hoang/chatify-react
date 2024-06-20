import { StatusSocket } from './socketSlice';
import { RootState } from './store';
import { UserState } from './userSlice';
import { ChatInfo } from '~/redux/currentChatSlice';

export const userSelector = (state: RootState): UserState => state.app.user!;
export const socketSelector = (state: RootState): WebSocket =>
    state.app.socket.socket!;
export const socketStatusSelector = (state: RootState): StatusSocket =>
    state.app.socket.statusSocket!;
export const currentChatSelector = (state: RootState):ChatInfo  => {
  return state.app.currentChat!;
};