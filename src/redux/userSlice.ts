import {createSlice, PayloadAction} from '@reduxjs/toolkit'

export interface UserState {
    username: string;
}

export const userInitState: UserState = {
    username: "",
}

export const userSlice = createSlice({
    name: 'user',
    initialState : userInitState,
    reducers: {
        setUserName: (state, action: PayloadAction<string>) => {
            state.username = action.payload
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
export const {setUserName, logout, setOnlineUser, setSocketConnection} = userSlice.actions;

export default userSlice.reducer;
