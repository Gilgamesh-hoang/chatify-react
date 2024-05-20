import {createSlice, PayloadAction} from '@reduxjs/toolkit'

interface UserState {
    _id: string;
    name: string;
    email: string;
    profile_pic: string;
    token: string;
    onlineUser: Array<string>; // Assuming onlineUser is an array of user IDs or names
    socketConnection: WebSocket | null; // Assuming socketConnection is of type WebSocket or null
}

const initialState: UserState = {
    _id: "",
    name: "",
    email: "",
    profile_pic: "",
    token: "",
    onlineUser: [],
    socketConnection: null
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<{ _id: string; name: string; email: string; profile_pic: string }>) => {

        },
        setToken: (state, action: PayloadAction<string>) => {
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
