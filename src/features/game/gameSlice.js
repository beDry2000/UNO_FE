import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

const initialState = {
    gameOver: true,
    winner: '',
    turn: '',
    deckOfPlayers: {},
    player1Deck: [],
    player2Deck: [],
    currentColor: '',
    currentNumber: '',
    playedCardsPile: [],
    drawCardPile: [],
    messages: [],
    autoCount: 0
}

let hasSent = false;

const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        resetGame: () => initialState,
        initializeGame: (_, { payload }) => payload,
        updateGame: (state, { payload }) => {
            const newState = {
                ...state,
                ...payload
            }
            console.log(newState);
            return newState;
        },
        updateMessage: (state, { payload }) => {
            if (!hasSent) {
                state.messages.push(payload);
                hasSent = true;
            } else {
                hasSent = false;
            }
        }
    }
})

export const { resetGame, initializeGame, updateGame, updateMessage } = gameSlice.actions;

export default gameSlice.reducer;