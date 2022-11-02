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
            console.log('State game moi ', payload);
            const newState = {
                ...state,
                ...payload
            }
            console.log(newState);
            return newState;
        },
        updateMessage: (state, { payload }) => {
            if (!hasSent) {
                console.log('Da gui chua', hasSent)
                state.messages.push(payload);
                hasSent = true;
            } else {
                console.log('Da gui roi nen khong update', hasSent);
                hasSent = false;
            }
        },
        setAutoCount: (state, {number}) => {
            console.log('AutoCount dang chay', number)
            state.autoCount = number;
            console.log('AutoCount dang chay', state.autoCount)
        }
    }
})

export const { resetGame, initializeGame, updateGame, updateMessage, setAutoCount } = gameSlice.actions;

export default gameSlice.reducer;