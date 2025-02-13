import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EnginesState {
    engineTitle: string; // Поле для фильтрации по названию двигателя
}

const initialState: EnginesState = {
    engineTitle: '', // Начальное значение пустое
};

const enginesSlice = createSlice({
    name: 'engines',
    initialState,
    reducers: {
        setEngineTitle(state, action: PayloadAction<string>) {
            state.engineTitle = action.payload;
        },
        resetEngineTitle(state) {
            state.engineTitle = '';
        },
    },
});

export const { setEngineTitle, resetEngineTitle } = enginesSlice.actions;

export default enginesSlice.reducer;
