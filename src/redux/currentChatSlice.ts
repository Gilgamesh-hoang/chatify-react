import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Message {
  name: string;
  type: 0 | 1;
  to: string;
  mes: string;
  createAt: Date;
}

export interface ChatInfo {
  type: number,
  name: string,
  profile_pic: string,
  online: boolean,
  page: number,
}

export const initCurrentChat: ChatInfo = {
  type: -1,
  name: '',
  profile_pic: '',
  online: false,
  page: 1,
};

const currentChatSlice = createSlice({
  name: 'app/currentChat',
  initialState: initCurrentChat,
  reducers: {
    setCurrentChat: (state, action: PayloadAction<ChatInfo>) => {
      state.type = action.payload.type
      state.name = action.payload.name
      state.page = 1
    },
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.online = action.payload
    },
  },
});


// Action creators are generated for each case reducer function
export const {setCurrentChat, setOnlineStatus} = currentChatSlice.actions;

export default currentChatSlice.reducer;