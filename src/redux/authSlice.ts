import {createSlice, PayloadAction} from '@reduxjs/toolkit'

export interface AuthState {
    isError: boolean ;
    isLoading : boolean ;
    isSuccess : boolean ;
    username : string;
    password : string;
}

const initialState: AuthState = {
    isError : false,
    isLoading : false,
    isSuccess : false,
    username : '',
    password : ''
}

export const authSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setPassword: (state, action: PayloadAction<{ name: string; email: string;}>) => {

        },
        setUsername: (state, action: PayloadAction<string>) => {
          
        },
       
    },
})

// Action creators are generated for each case reducer function
export const {setPassword, setUsername} = authSlice.actions;

export default authSlice.reducer;
