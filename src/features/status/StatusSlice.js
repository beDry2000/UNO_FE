import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    statusIndex: "login"
}
const statusSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state) => {
            state.statusIndex = "login"
        },
        signin: (state) => {
            state.statusIndex = "signin"
        },
        guest: (state) => {
            state.statusIndex = "guest"
        },
        logined: (state) => {
            state.statusIndex = "logined"
        }
    },
})

export const { login, signin, guest, logined } = statusSlice.actions;

export default statusSlice.reducer;