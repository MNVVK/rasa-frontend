// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../api';
import { setId, setEnginesCount } from './draftSlice';
import { mockEngines } from '../api/data.ts';
import {Engine} from "../api/Api.ts";


interface EnginesState {
    engineTitle: string;
    engines: Engine[];
    loading: boolean;
    error: string | null;
}

const initialState: EnginesState = {
    engineTitle: '',
    engines: [],
    loading: false,
    error: null,
};

// Асинхронное действие для получения списка услуг
export const getEnginesList = createAsyncThunk(
    'engines/getEnginesList',
    async (_, { getState, dispatch, rejectWithValue }) => {
        const { engines }: unknown = getState();
        try {
            const response = await api.engines.enginesList({ engine_title: engines.engineTitle });
            if (response.data.draft_id) {
                dispatch(setId(response.data.draft_id));
                dispatch(setEnginesCount(response.data.draft_engines_count));
            }
            return response.data;
        } catch (error) {
            return rejectWithValue('Ошибка при загрузке данных: ' + error);
        }
    }
);

// Асинхронное действие для получения услуги по ID
export const getEngineById = createAsyncThunk(
    'engines/getEngineById',
    async (engineId: number, { rejectWithValue }) => {
        try {
            const response = await api.engines.enginesRead(engineId);
            return response.data;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return rejectWithValue('Ошибка при загрузке данных об услуге');
        }
    }
);

// Асинхронное действие для добавления новой услуги
export const addEngineAsync = createAsyncThunk(
    'engines/addEngine',
    async (newEngine: Engine, { rejectWithValue }) => {
        try {
            const response = await api.engines.enginesCreate(newEngine);
            return response.data;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return rejectWithValue('Ошибка при добавлении услуги');
        }
    }
);

// Асинхронное действие для обновления услуги
export const updateEngineAsync = createAsyncThunk(
    'engines/updateEngine',
    async (updatedEngine: Engine, { rejectWithValue }) => {
        try {
            const response = await api.engines.enginesUpdate(updatedEngine.id!, updatedEngine);
            return response.data;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return rejectWithValue('Ошибка при обновлении услуги');
        }
    }
);

// Асинхронное действие для удаления услуги
export const deleteEngineAsync = createAsyncThunk(
    'engines/deleteEngine',
    async (engineId: number, { rejectWithValue }) => {
        try {
            await api.engines.enginesDelete(engineId);
            return engineId;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return rejectWithValue('Ошибка при удалении услуги');
        }
    }
);

const enginesSlice = createSlice({
    name: 'engines',
    initialState,
    reducers: {
        setEngineTitle: (state, action: PayloadAction<string>) => {
            state.engineTitle = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getEnginesList.fulfilled, (state, action) => {
                state.engines = action.payload.engines;
                state.loading = false;
            })
            .addCase(getEnginesList.rejected, (state) => {
                state.engines = mockEngines;
                state.loading = false;
            })
            .addCase(getEnginesList.pending, (state) => {
                state.loading = true;
            })
            .addCase(addEngineAsync.fulfilled, (state, action) => {
                state.engines.push(action.payload);
            })
            .addCase(updateEngineAsync.fulfilled, (state, action) => {
                const index = state.engines.findIndex((engine) => engine.id === action.payload.id);
                if (index !== -1) state.engines[index] = action.payload;
            })
            .addCase(deleteEngineAsync.fulfilled, (state, action) => {
                state.engines = state.engines.filter((engine) => engine.id !== action.payload);
            })
            .addCase(getEngineById.fulfilled, (state, action) => {
                const index = state.engines.findIndex((engine) => engine.id === action.payload.id);
                if (index !== -1) {
                    state.engines[index] = action.payload;
                } else {
                    state.engines.push(action.payload);
                }
            });
    },
});

export const { setEngineTitle } = enginesSlice.actions;
export default enginesSlice.reducer;
