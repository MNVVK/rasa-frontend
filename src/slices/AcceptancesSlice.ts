import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {api} from '../api';
import {Acceptance} from "../api/Api.ts";

// Интерфейс состояния слайса
interface AcceptancesState {
    acceptances: Acceptance[];
    loading: boolean;
    error: string | null;
}

// Начальное состояние
const initialState: AcceptancesState = {
    acceptances: [],
    loading: false,
    error: null,
};

// Асинхронное действие для получения списка заявок с фильтрами
export const getAcceptances = createAsyncThunk(
    'acceptances/getAcceptances',
    async (filters: { status?: string; date_start?: string; date_end?: string }) => {
        const response = await api.acceptances.acceptancesList({ query: filters });
        return response.data;
    }
);

// Асинхронное действие для удаления заявки
export const deleteAcceptance = createAsyncThunk(
    'acceptances/deleteAcceptance',
    async (id: string) => {
        await api.acceptances.acceptancesDelete(id);
        return id;
    }
);

// Асинхронное действие для завершения или отклонения заявки
export const moderateAcceptance = createAsyncThunk(
    'acceptances/completeAcceptance',
    async ({ id, status }: { id: string; status: 'complete' | 'reject' }) => {
        await api.acceptances.acceptancesModerateCreate(id, { status: status });
        return { id, status };
    }
);

const acceptancesSlice = createSlice({
    name: 'acceptances',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAcceptances.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAcceptances.fulfilled, (state, action) => {
                state.loading = false;
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                state.acceptances = action.payload;
            })
            .addCase(getAcceptances.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Ошибка при получении заявок';
            })
            .addCase(deleteAcceptance.fulfilled, (state, action) => {
                state.acceptances = state.acceptances.filter(
                    (acceptance) => acceptance.id !== parseInt(action.payload)
                );
            })
            .addCase(moderateAcceptance.fulfilled, (state, action) => {
                state.acceptances = state.acceptances.map((acceptance) =>
                    acceptance.id === parseInt(action.payload.id)
                        ? {...acceptance, status: (action.payload.status === "complete" ? "completed" : "rejected")}
                        : acceptance
                );
            });
    },
});

export default acceptancesSlice.reducer;
