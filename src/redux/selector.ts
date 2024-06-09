import {RootState} from "./store";
import {UserState} from "./userSlice";

export const userSelector = (state : RootState) : UserState => state.app.user!
// export const socketSelector = (state : RootState) : WebSocket => state.app.socket!
export const socketSelector = (state : RootState) => state.app.socket!