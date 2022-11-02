import { configureStore } from "@reduxjs/toolkit";

import userReducer from '../features/user/userSlice';
import roomReducer from '../features/room/roomSlice';
import gameReducer from '../features/game/gameSlice';
export const store = configureStore({
  reducer: {
    user: userReducer,
    room: roomReducer,
    game: gameReducer,
  },
});
