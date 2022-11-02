import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from './userService';

const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
    user: user ?? null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: ''
}

export const register = createAsyncThunk('user/register', async (user, thunkAPI) => {
    try {
        return await userService.register(user);
    } catch (err) {
        const message =
            (err.response && err.response.data && err.response.data.message)
            || err.message
            || err.toString();
        return thunkAPI.rejectWithValue(message);
    }
})


export const login = createAsyncThunk('user/login', async (user, thunkAPI) => {
    try {
        return await userService.login(user);
    } catch (err) {
        const message =
            (err.response && err.response.data && err.response.data.message)
            || err.message
            || err.toString();
        return thunkAPI.rejectWithValue(message);
    }
})

export const createGuest = createAsyncThunk('user/createGuest', async (user, thunkAPI) => {
    try {
        return await userService.createGuest(user);
    } catch (err) {
        const message =
            (err.response && err.response.data && err.response.data.message)
            || err.message
            || err.toString();
        return thunkAPI.rejectWithValue(message);
    }
})

export const deleteUser = createAsyncThunk('user/delUser', async (_, thunkAPI) => {
    try {
        const id = thunkAPI.getState().user.user.id;
        return await userService.deleteUser(id);
    } catch (err) {
        const message =
            (err.response && err.response.data && err.response.data.message)
            || err.message
            || err.toString();
        return thunkAPI.rejectWithValue(message);
    }
})

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = '';
        },
        logout: (state) => {
            state.user = null;
        }
    },
    extraReducers(builder) {
        builder
            .addCase(register.fulfilled, (state) => {
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(login.pending, state => {
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.user = null;
                state.message = action.payload;
            })
            .addCase(createGuest.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(createGuest.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.user = null;
                state.message = action.payload;
            })
    }
})

export const { reset, logout } = userSlice.actions;

export default userSlice.reducer;

