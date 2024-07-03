import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Information of user taken from GET_USER_LIST
export interface UserInfo {
  name: string,
  type: 0 | 1,
  actionTime?: Date,
}

// Information of the message
export interface Message {
  id?: number,
  name: string,
  to: string,
  type: 0 | 1,
  mes: string,
  createAt: Date,
}

// Information of the group chat
export interface RoomChat {
  name: string,
  own: string,
  userList: string[],
}

// Information per user with messages
export interface ChatInfo {
  type: 0 | 1,
  name: string,
  profile_pic: string,
  online: boolean,
  moreMessage: boolean,
  page: number,
  offset: number,
  read: boolean,
  messages: Message[] | undefined,
  room_owner?: string,
  room_member?: string[],
}

const defaultChatInfo:ChatInfo = {
  type: 0,
  name: '',
  profile_pic: '',
  online: false,
  read: true,
  messages: undefined,
  moreMessage: false,
  page: 0,
  offset: 0,
};

// Container of many ChatInfo
export interface ChatData {
  userList: ChatInfo[],
}

const initChatData: ChatData = {
  userList: [],
};

const chatDataSlice = createSlice({
  name: 'app/chatData',
  initialState: initChatData,
  reducers: {
    // set user list to chat
    setChatDataUsers: (state, action: PayloadAction<UserInfo[]>) => {
      while (state.userList.length > 0)
        state.userList.shift();
      action.payload.forEach((user) => state.userList.push({
        ...defaultChatInfo,
        name: user.name,
        type: user.type,
      }));
    },
    // update a chat data room
    updateChatDataRooms: (state, action: PayloadAction<{ name: string, roomData: RoomChat }>) => {// first, find the user with the name
      const index = state.userList.findIndex((user) => user.name === action.payload.name);
      // if founded
      if (index >= 0) {
        state.userList[index] = {
          ...state.userList[index],
          room_owner: action.payload.roomData.own,
          room_member: action.payload.roomData.userList,
        };
      } else {
        alert('Can\'t find the user list while status to list');
      }
    },
    // set online user
    setChatDataUserOnline: (state, action: PayloadAction<{ name: string, online: boolean }>) => {
      // first, find the user with the name
      const index = state.userList.findIndex((user) => user.name === action.payload.name);
      // if founded
      if (index >= 0) {
        if (state.userList[index].online !== action.payload.online)
          state.userList[index].online = action.payload.online;
      } else {
        alert('Can\'t find the user list while status to list');
      }
    },
    // set messages to the list (only get call on startup)
    setMessageListToChat: (state, action: PayloadAction<{ name: string, currentUsername: string, messages: Message[] }>) => {
      // first, find the user with the name
      const index = state.userList.findIndex((user) => user.name === action.payload.name);
      // if founded
      if (index >= 0) {
        // convert all message date to REAL DATE
        action.payload.messages.forEach((message) => message.createAt = new Date(message.createAt));
        state.userList[index].messages = action.payload.messages;
        state.userList[index].moreMessage = action.payload.messages.length >= 50;
        state.userList[index].offset = 0;
        if (action.payload.messages.length > 0)
        if ((
          ((action.payload.messages[0].type === 1 && action.payload.messages[0].name !== action.payload.currentUsername && action.payload.messages[0].to === action.payload.name)
          || (action.payload.messages[0].type === 0 && action.payload.messages[0].to === action.payload.currentUsername)) && state.userList[index].read)
        ) {
          // console.log("Hey unread this!", action.payload.name, 'as', action.payload.currentUsername)
          const date = localStorage.getItem(`unseen_${action.payload.name}`);
          if (!date || action.payload.messages[0].createAt > new Date(parseInt(date) - 7 * 3600 * 1000)) {
            state.userList[index].read = false;
          }
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
        for (let i = 0; i < state.userList[index].offset % 50; i++) {
          action.payload.messages.shift();
        }
        //then append them and update page and check for more messages
        if (state.userList[index].messages === undefined) {
          state.userList[index].messages = action.payload.messages;
        }
        else {
          state.userList[index].messages = state.userList[index].messages!.concat(action.payload.messages);
        }
        state.userList[index].moreMessage = action.payload.messages.length > 0;
        state.userList[index].page = action.payload.page;
        state.userList[index].offset = 0;
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
        if (!state.userList[index].messages)
          state.userList[index].messages = [];
        // put new message in here
        state.userList[index].messages!.unshift({
          ...action.payload.message,
          createAt: new Date(action.payload.message.createAt),
        });
        // the offset for next GET_MESSAGE_FOR_NEXT_PAGE
        state.userList[index].offset++;
        // Set read status to state it received (sent success = read, received = haven't read)
        state.userList[index].read = action.payload.type === 'sent';
        // put the chat data at the top of the list
        const arr = state.userList.filter((_user, i) => i !== index);
        arr.unshift(state.userList[index]);
        state.userList = arr;
      } else {
        alert('Can\'t find the user list while on received');
      }
    },
    setReadStatus: (state, action: PayloadAction<{ name: string, seenStatus: boolean }>) => {
      // first, find the user with the name
      const index = state.userList.findIndex((user) => user.name === action.payload.name);
      // if founded
      if (index >= 0) {
        // put new message in here
        state.userList[index].read = action.payload.seenStatus;
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
  setReadStatus,
  appendMessageListToChat,
  updateChatDataRooms,
} = chatDataSlice.actions;

export default chatDataSlice.reducer;