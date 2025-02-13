// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {api} from '../api';
import {Acceptance, EngineAcceptance} from '../api/Api.ts';

// Интерфейс состояния черновой заявки
interface DraftAcceptanceState {
    id: number | undefined;
    enginesCount: number | undefined;
    engineAcceptanceSet: EngineAcceptance[];
    acceptanceData: Acceptance;
    isDraft: boolean;
    loading: boolean;
    error: string | null;
}

// Начальное состояние
const initialState: DraftAcceptanceState = {
    id: undefined,
    enginesCount: undefined,
    engineAcceptanceSet: [],
    acceptanceData: {
        id: undefined,
        title: '',
        creator: '',
        status: 'draft',
        formation_date: null,
        completion_date: null,
        total_accepted: null,
    },
    isDraft: true,
    loading: false,
    error: null,
};

// Асинхронное действие для получения заявки
export const getAcceptance = createAsyncThunk(
    'draftAcceptance/getAcceptance',
    async (id: number, {rejectWithValue}) => {
        try {
            const response = await api.acceptances.acceptancesRead(id);
            return response.data;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return rejectWithValue('Ошибка при получении заявки');
        }
    }
);

// Асинхронное действие для получения черновой заявки
export const getDraftAcceptance = createAsyncThunk(
    'draftAcceptance/getDraftAcceptance',
    async (id: number, {rejectWithValue}) => {
        try {
            const response = await api.acceptances.acceptancesRead(id);
            return response.data;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return rejectWithValue('Ошибка при получении черновой заявки');
        }
    }
);

// Асинхронное действие для добавления связи EngineAcceptance
export const addEngineToAcceptance = createAsyncThunk(
    'draftAcceptance/addEngineToAcceptance',
    async (engineId: number, {rejectWithValue}) => {
        try {
            const response = await api.engines.enginesAddToDraftCreate(engineId);
            return response.data;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return rejectWithValue('Ошибка при добавлении связи EngineAcceptance');
        }
    }
);

// Асинхронное действие для удаления связи EngineAcceptance
export const deleteEngineFromAcceptance = createAsyncThunk(
    'draftAcceptance/deleteEngineFromAcceptance',
    async (engineId: number, {rejectWithValue}) => {
        try {
            await api.engines.enginesManageDraftDelete(engineId);
            return engineId;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return rejectWithValue('Ошибка при удалении связи EngineAcceptance');
        }
    }
);

// Асинхронное действие для обновления данных заявки
export const updateAcceptanceAsync = createAsyncThunk(
    'draftAcceptance/updateAcceptance',
    async ({id, data}: { id: number; data: Acceptance }, {rejectWithValue}) => {
        try {
            const response = await api.acceptances.acceptancesUpdate(id, data);
            return response.data;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return rejectWithValue('Ошибка при обновлении заявки');
        }
    }
);

// Асинхронное действие для отправки заявки
export const submitAcceptance = createAsyncThunk(
    'draftAcceptance/submitAcceptance',
    async (id: number, {rejectWithValue}) => {
        try {
            await api.acceptances.acceptancesFormCreate(id);
            return id;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return rejectWithValue('Ошибка при отправке заявки');
        }
    }
);

// Асинхронное действие для удаления заявки
export const deleteAcceptance = createAsyncThunk(
    'draftAcceptance/deleteAcceptance',
    async (id: number, {rejectWithValue}) => {
        try {
            await api.acceptances.acceptancesDelete(id);
            return id;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return rejectWithValue('Ошибка при удалении заявки');
        }
    }
);

// Асинхронное действие для обновления связи EngineAcceptance
export const updateEngineAcceptance = createAsyncThunk(
    'draftAcceptance/updateEngineAcceptance',
    async ({id, accepted}: { id: number; accepted: string }, {rejectWithValue}) => {
        try {
            const response = await api.engines.enginesManageDraftUpdate(id, {accepted: accepted});
            return response.data;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return rejectWithValue('Ошибка при обновлении EngineAcceptance');
        }
    }
);

// Слайс для черновой заявки
const draftAcceptanceSlice = createSlice({
    name: 'draftAcceptance',
    initialState,
    reducers: {
        setId: (state, action) => {
            state.id = action.payload;
        },
        setEnginesCount: (state, action) => {
            state.enginesCount = action.payload;
        },
        setAcceptanceData: (state, action) => {
            state.acceptanceData = {...state.acceptanceData, ...action.payload};
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAcceptance.fulfilled, (state, action) => {
                state.acceptanceData = action.payload;
                state.engineAcceptanceSet = action.payload.engines;
                state.isDraft = action.payload.status === 'draft';
                state.loading = false
                state.error = null
            })
            .addCase(getAcceptance.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(getAcceptance.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string;
            })
            .addCase(getDraftAcceptance.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getDraftAcceptance.fulfilled, (state, action) => {
                state.loading = false;
                state.acceptanceData = action.payload;
                state.isDraft = action.payload.status === 'draft';
            })
            .addCase(getDraftAcceptance.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(addEngineToAcceptance.fulfilled, (state, action) => {
                state.engineAcceptanceSet.push(action.payload);
            })
            .addCase(deleteEngineFromAcceptance.fulfilled, (state, action) => {
                state.engineAcceptanceSet = state.engineAcceptanceSet.filter(
                    (item) => item.engine.id !== action.payload
                );
            })
            .addCase(updateAcceptanceAsync.fulfilled, (state, action) => {
                state.acceptanceData = action.payload;
            })
            .addCase(submitAcceptance.fulfilled, (state) => {
                state.id = undefined;
                state.enginesCount = undefined;
                state.engineAcceptanceSet = [];
                state.acceptanceData = initialState.acceptanceData;
                state.isDraft = false;
            })
            .addCase(deleteAcceptance.fulfilled, (state) => {
                state.id = undefined;
                state.enginesCount = undefined;
                state.engineAcceptanceSet = [];
                state.acceptanceData = initialState.acceptanceData;
                state.isDraft = false;
            })
            .addCase(updateEngineAcceptance.fulfilled, (state, action) => {
                const index = state.engineAcceptanceSet.findIndex(item => item.engine.id === action.payload.engine.id);
                if (index !== -1) {
                    state.engineAcceptanceSet[index] = action.payload;
                }
            });
    },
});

export const {setId, setEnginesCount, setAcceptanceData} = draftAcceptanceSlice.actions;
export default draftAcceptanceSlice.reducer;
