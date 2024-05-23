import { Reducer } from "redux";
import { AuthState } from "./authSlice";
import { RootState } from "./store";
import { UserState } from "./userSlice";

export const userSelector = (state : RootState) : UserState => state.user
export const authSelector  = (state : RootState): AuthState => state.auth