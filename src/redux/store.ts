import { Reducer, configureStore } from '@reduxjs/toolkit'
import userReducer, { UserState } from './userSlice'
import socketSlice, { SocketState } from './socketSlice'
import websocketMiddleware from './middleware/socketMiddleware'
export interface RootStateType {
    app : Reducer<SocketState>
   
}
const rootReducer:RootStateType =  {
    app : socketSlice,

}
export const store = configureStore({
    reducer : rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(websocketMiddleware),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch