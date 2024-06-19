import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ChatInfo {
  type: number,
  name: string,
  profile_pic: string,
  online: boolean,

}

export const initCurrentChat: ChatInfo = {
  type: -1,
  name: '',
  profile_pic: '',
  online: false
};

const currentChatSlice = createSlice({
  name: 'app/currentChat',
  initialState: initCurrentChat,
  reducers: {
    setCurrentChat: (state, action: PayloadAction<ChatInfo>) => {
      state.type = action.payload.type
      state.name = action.payload.name
      state.profile_pic = action.payload.profile_pic
      state.online = action.payload.online
    },
    clearCurrentChat: (state) => {
      state.type = -1
      state.name = ''
      state.profile_pic = ''
      state.online = false
    }
  },
});


// Action creators are generated for each case reducer function
export const {setCurrentChat, clearCurrentChat} = currentChatSlice.actions;

export default currentChatSlice.reducer;