import { createSlice, Dispatch, UnknownAction } from '@reduxjs/toolkit'


interface LoginUser {
    username: string,
    password: string
}
export interface RootState {
    auth: {
      isLoaded: boolean;
      isAuthenticated: boolean;
      user: any;
    };
}

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isLoaded: false,
        isAuthenticated: false,
        user: undefined,
    },
    reducers: {
        Loaded: (state) => {
            state.isLoaded = true;
        },
        RegisterSuccess: (state, action) => {
            const loginData = action.payload;
            state.isAuthenticated = true;
            state.user = loginData;
        },
        LoginSuccess: (state, action) => {
            const loginData = action.payload;
            state.isAuthenticated = true;
            state.user = loginData.user
        },
        Logout: (state) => {
            state.isAuthenticated = false;
            state.user = undefined
        },
    },
})

// Action creators are generated for each case reducer function
export const { Loaded, RegisterSuccess, LoginSuccess, Logout } = authSlice.actions

export default authSlice.reducer