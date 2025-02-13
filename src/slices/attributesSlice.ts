import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { api } from "../api";
import {Attribute} from "../api/Api.ts";


interface EngineAttributesState {
    attributes: Attribute[];
    loading: boolean;
    error: string | null;
}

// Начальное состояние
const initialState: EngineAttributesState = {
    attributes: [],
    loading: false,
    error: null,
};

// Асинхронное действие для получения списка атрибутов
export const fetchEngineAttributes = createAsyncThunk(
    "attributes/fetchEngineAttributes",
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await api.attributes.getEngineAttributes(id);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data || "Ошибка при загрузке атрибутов");
        }
    }
);

// Асинхронное действие для добавления атрибута
export const addEngineAttribute = createAsyncThunk(
    "attributes/addEngineAttribute",
    async ({ id, name, value }: { id: number; name: string; value: string }, { rejectWithValue }) => {
        try {
            await api.attributes.addEngineAttribute(id, { name, value });
            return { name, value };
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data || "Ошибка при добавлении атрибута");
        }
    }
);

// Асинхронное действие для удаления атрибута
export const deleteEngineAttribute = createAsyncThunk(
    "attributes/deleteEngineAttribute",
    async ({ id, name }: { id: number; name: string }, { rejectWithValue }) => {
        try {
            await api.attributes.deleteEngineAttribute(id, { name });
            return name;
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data || "Ошибка при удалении атрибута");
        }
    }
);

// Асинхронное действие для обновления значения атрибута
export const updateEngineAttribute = createAsyncThunk(
    "attributes/updateEngineAttribute",
    async ({ id, name, value }: { id: number; name: string; value?: string }, { rejectWithValue }) => {
        try {
            const response = await api.attributes.updateEngineAttribute(id, { name, value });
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data || "Ошибка при обновлении атрибута");
        }
    }
);

// Создание слайса
const attributesSlice = createSlice({
    name: "attributes",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchEngineAttributes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEngineAttributes.fulfilled, (state, action) => {
                state.loading = false;
                state.attributes = action.payload.attributes;
            })
            .addCase(fetchEngineAttributes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(addEngineAttribute.fulfilled, (state, action) => {
                state.attributes.push(action.payload);
            })
            .addCase(deleteEngineAttribute.fulfilled, (state, action) => {
                state.attributes = state.attributes.filter(attr => attr.name !== action.payload);
            })
            .addCase(updateEngineAttribute.fulfilled, (state, action) => {
                const { name, value, status } = action.payload;
                if (status === "deleted") {
                    state.attributes = state.attributes.filter(attr => attr.name !== name);
                } else {
                    const attribute = state.attributes.find(attr => attr.name === name);
                    if (attribute) {
                        attribute.value = value || "";
                    }
                }
            });
    },
});

export default attributesSlice.reducer;
