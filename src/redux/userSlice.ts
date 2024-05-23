import {createSlice, PayloadAction} from '@reduxjs/toolkit'

export interface UserState {
    username: string;
    token: string;
    socketConnection: WebSocket | null;
}

const initialState: UserState = {
    username: "",
    token : "",
    socketConnection: null
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<{ name: string; email: string;}>) => {

        },
        setToken: (state, action: PayloadAction<string>) => {
            state.username = "";
            state.token = "";
        },
        logout: (state) => {

        },
        setOnlineUser: (state, action: PayloadAction<Array<string>>) => {

        },
        setSocketConnection: (state, action: PayloadAction<WebSocket | null>) => {

        }
    },
})

// Action creators are generated for each case reducer function
export const {setUser, setToken, logout, setOnlineUser, setSocketConnection} = userSlice.actions;

export default userSlice.reducer;
