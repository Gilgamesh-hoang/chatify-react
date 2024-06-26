import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Message {
  id?: number,
  name: string,
  to: string,
  type: 0 | 1,
  mes: string,
  createAt: Date,
}

// Information per user with messages
export interface ChatInfo {
  type: number,
  name: string,
  profile_pic: string,
  online: boolean,
  moreMessage: boolean,
  page: number,
  offset: number,
  messages: Message[],
}

// Container of many ChatInfo
export interface ChatData {
  userList: ChatInfo[],
}

export const initChatData: ChatData = {
  userList: [],
};

const chatDataSlice = createSlice({
  name: 'app/chatData',
  initialState: initChatData,
  reducers: {
    // add user to list
    setChatDataUsers: (state, action: PayloadAction<ChatInfo[]>) => {
      state.userList = action.payload;
    },
    // set online user
    setChatDataUserOnline: (state, action: PayloadAction<{ name: string, online: boolean }>) => {
      // first, find the user with the name
      const index = state.userList.findIndex((user) => user.name === action.payload.name);
      // if founded
      if (index >= 0) {
        if (state.userList[index].online !== action.payload.online)
          state.userList[index].online = action.payload.online
      }
      else {
        alert('Can\'t find the user list while status to list');
      }
    },
    // set messages to the list
    setMessageListToChat: (state, action: PayloadAction<{ name: string, messages: Message[] }>) => {
      // if there's no message data, no
      if (!action.payload.messages) return;

      // first, find the user with the name
      const index = state.userList.findIndex((user) => user.name === action.payload.name);
      // if founded
      if (index >= 0) {
        // convert all message date to REAL DATE
        action.payload.messages.forEach((message) => message.createAt = new Date(message.createAt));
        state.userList[index].messages = action.payload.messages;
        state.userList[index].moreMessage = action.payload.messages.length >= 50;
        state.userList[index].offset = 0;
      } else {
        alert('Can\'t find the user list while add messages to list');
      }
    },
    // append messages to the list
    appendMessageListToChat: (state, action: PayloadAction<{ name: string, page: number, messages: Message[] }>) => {
      // first, find the user with the name
      const index = state.userList.findIndex((user) => user.name === action.payload.name);
      // if founded
      if (index >= 0) {
        // convert all message date to REAL DATE
        action.payload.messages.forEach((message) => message.createAt = new Date(message.createAt));
        state.userList[index].messages = state.userList[index].messages.concat(action.payload.messages.filter(
          (message, i) => i >= state.userList[index].offset));
        state.userList[index].moreMessage = action.payload.messages.length > 0;
        state.userList[index].page = action.payload.page;
      } else {
        alert('Can\'t find the user list while add messages to list');
      }
    },
    // on received or sent message, do the classic
    setUpdateNewMessage: (state, action: PayloadAction<{ type: 'sent' | 'received', message: Message }>) => {
      // if there's no message data, no
      if (!action.payload) return;
      const receiver = action.payload.type === 'received' ? (action.payload.message.type === 1 ? action.payload.message.to : action.payload.message.name) : action.payload.message.to;
      // first, find the user with the name
      const index = state.userList.findIndex((user) => user.name === receiver);
      // if founded
      if (index >= 0) {
        state.userList[index].messages.unshift({
          ...action.payload.message,
          createAt: new Date(action.payload.message.createAt),
        });
        state.userList[index].offset++;
        const arr = state.userList.filter((user, i) => i !== index);
        arr.unshift(state.userList[index]);
        state.userList = arr;
      } else {
        alert('Can\'t find the user list while on received');
      }
    },
  },
});


// Action creators are generated for each case reducer function
export const {
  setChatDataUsers,
  setChatDataUserOnline,
  setMessageListToChat,
  setUpdateNewMessage,
  appendMessageListToChat,
} = chatDataSlice.actions;

export default chatDataSlice.reducer;