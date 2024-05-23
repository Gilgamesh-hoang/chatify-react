import { Reducer, configureStore } from '@reduxjs/toolkit'
import userReducer, { UserState } from './userSlice'
import authSlice, { AuthState } from './authSlice';

export interface RootState {
    user : UserState
    auth : AuthState
}
export interface RootStateType {
    user : Reducer<UserState>
    auth : Reducer<AuthState>
}
const rootReducer:RootStateType =  {
    user : userReducer,
    auth : authSlice

}
export const store = configureStore({
    reducer : rootReducer
});
export type AppDispatch = typeof store.dispatch