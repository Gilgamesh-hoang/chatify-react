import { Reducer, configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer, { UserState } from './userSlice';
import socketSlice, { SocketState } from './socketSlice';
import websocketMiddleware from './middleware/socketMiddleware';
import partnerSlice from './partnerSlice';
//
// export interface RootStateType {
//     app : Reducer<SocketState>
//     user: Reducer<UserState>;
//
// }
// const rootReducer:RootStateType =  {
//     app : socketSlice,
//     user: userReducer,
//
// }
// export const store = configureStore({
//     reducer : rootReducer,
//     middleware: (getDefaultMiddleware) =>
//         getDefaultMiddleware().concat(websocketMiddleware),
// });
const rootReducer = combineReducers({
  user: userReducer,
  socket: socketSlice,
  partner: partnerSlice,
});

export const store = configureStore({
  reducer: {
    app: rootReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(websocketMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
