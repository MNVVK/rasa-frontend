import { configureStore } from '@reduxjs/toolkit';
import usersSlice from "./slices/usersSlice.ts";
import enginesSlice from "./slices/enginesSlice";
import acceptancesSlice from "./slices/AcceptancesSlice.ts";
import draftSlice from "./slices/draftSlice.ts";
import attributesSlice from "./slices/attributesSlice.ts"; // Импортируем наш слайс

// Создаем store
export const store = configureStore({
    reducer: {
        engines: enginesSlice,
        users: usersSlice,
        acceptances: acceptancesSlice,
        draft: draftSlice,
        attribute: attributesSlice,
    },
});

// Экспортируем типы для использования в приложении
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
