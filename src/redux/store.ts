import {configureStore, combineReducers} from '@reduxjs/toolkit'
import userReducer from './userSlice'
import socketSlice from './socketSlice'
import websocketMiddleware from './middleware/socketMiddleware'
import chatDataSlice from '~/redux/chatDataSlice'
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
    chatData: chatDataSlice,
});

export const store = configureStore({
    reducer: {
        app: rootReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(websocketMiddleware),
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch