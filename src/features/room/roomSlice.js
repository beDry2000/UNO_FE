import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import roomService from './roomService';

const user = localStorage.getItem('user');

const initialState = {
    roomCode: '',
    users: [],
    currentUser: user ?? null,
    message: '',
    messages: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    alert: ''
}

export const joinRoom = createAsyncThunk('room/joinRoom', async (roomCode, thunkAPI) => {
    try {
        const userId = thunkAPI.getState().user.user.id;
        return await roomService.joinRoom(roomCode, userId);
    } catch (err) {
        const message =
            (err.response && err.response.data && err.response.data.message)
            || err.message
            || err.toString();
        return thunkAPI.rejectWithValue(message);
    }
})

export const createRoom = createAsyncThunk('room/createRoom', async (_, thunkAPI) => {
    try {
        const userId = thunkAPI.getState().user.user.id;
        return await roomService.createRoom(userId);
    } catch (err) {
        const message =
            (err.response && err.response.data && err.response.data.message)
            || err.message
            || err.toString();
        return thunkAPI.rejectWithValue(message);
    }
})

export const leaveRoom = createAsyncThunk('room/leaveRoom', async (_, thunkAPI) => {
    try {
        const userId = thunkAPI.getState().user.user.id;
        return await roomService.leaveRoom(userId);
    } catch (err) {
        const message =
            (err.response && err.response.data && err.response.data.message)
            || err.message
            || err.toString();
        return thunkAPI.rejectWithValue(message);
    }
})

const roomSlice = createSlice({
    name: 'room',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.alert = '';
        },
        updateUsers: (state, { payload }) => {
            state.roomCode = payload.roomCode;
            state.users = payload.users;
        },
        setCurrentUser: (state, {payload}) => {
            console.log('SetCurrentUser', payload)
            state.currentUser = payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(joinRoom.pending, state => {
                state.isLoading = true;
            })
            .addCase(joinRoom.fulfilled, (state, { payload }) => {
                state.roomCode = payload[0].roomCode;
                state.users = payload;
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(joinRoom.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.alert = action.payload;
            })
            .addCase(createRoom.pending, state => {
                state.isLoading = true;
            })
            .addCase(createRoom.fulfilled, (state, { payload }) => {
                state.isLoading = false;
                state.isSuccess = true;
                // state.currentUser = payload;
                state.roomCode = payload.roomCode;
                state.users = [payload];
            })
            .addCase(createRoom.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.alert = action.payload;
            })
            .addCase(leaveRoom.fulfilled, () => initialState)

    }
})

export const { reset, updateUsers,setCurrentUser } = roomSlice.actions;

export default roomSlice.reducer;