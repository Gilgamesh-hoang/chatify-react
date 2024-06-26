import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Message {
  id?: number,
  name: string,
  to: string,
  type: 0 | 1,
  mes: string,
  createAt: Date,
}

export interface RoomChat {
  name: string,
  own: string,
  userList: string[],
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
  room_owner?: string,
  room_member?: string[],
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
    // set user list to chat
    setChatDataUsers: (state, action: PayloadAction<ChatInfo[]>) => {
      state.userList = action.payload;
    },
    // add a chat data for person
    addChatDataUser: (state, action: PayloadAction<string>) => {
      state.userList.unshift({
        messages: [],
        type: 0,
        name: action.payload,
        offset: 0,
        moreMessage: false,
        profile_pic: '',
        online: false,
        page: 1
      })
    },
    // add a chat data room
    addChatDataRooms: (state, action: PayloadAction<RoomChat>) => {
      state.userList.unshift({
        room_owner: action.payload.name,
        room_member: action.payload.userList,
        messages: [],
        type: 1,
        name: action.payload.name,
        offset: 0,
        moreMessage: false,
        profile_pic: '',
        online: false,
        page: 1
      })
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
    // set messages to the list (only get call on startup)
    setMessageListToChat: (state, action: PayloadAction<{ name: string, messages: Message[] }>) => {
      // first, find the user with the name
      const index = state.userList.findIndex((user) => user.name === action.payload.name);
      // if founded
      if (index >= 0) {
        // convert all message date to REAL DATE
        action.payload.messages.forEach((message) => message.createAt = new Date(message.createAt));
        state.userList[index].messages = action.payload.messages;
        state.userList[index].moreMessage = action.payload.messages.length >= 50;
        state.userList[index].offset = 0;
        if (state.userList[index].type === 1) {

        }
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
        // remove offset amount of message from sending and receiving message.
        for (let i = 0; i < state.userList[index].offset; i++) {
          action.payload.messages.shift();
        }
        //then append them and update page and check for more messages
        state.userList[index].messages = state.userList[index].messages.concat(action.payload.messages);
        state.userList[index].moreMessage = action.payload.messages.length > 0;
        state.userList[index].page = action.payload.page;
      } else {
        alert('Can\'t find the user list while add messages to list');
      }
    },
    // on received or sent message, do the classic
    setUpdateNewMessage: (state, action: PayloadAction<{ type: 'sent' | 'received', message: Message }>) => {
      const receiver = action.payload.type === 'received' ? (action.payload.message.type === 1 ? action.payload.message.to : action.payload.message.name) : action.payload.message.to;
      // first, find the user with the name
      const index = state.userList.findIndex((user) => user.name === receiver);
      // if founded
      if (index >= 0) {
        // put new message in here
        state.userList[index].messages.unshift({
          ...action.payload.message,
          createAt: new Date(action.payload.message.createAt),
        });
        // the offset for next GET_MESSAGE_FOR_NEXT_PAGE
        state.userList[index].offset++;
        // put the chat data at the top of the list
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