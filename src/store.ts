import { configureStore } from '@reduxjs/toolkit';
import enginesReducer from './slices/enginesSlice'; // Импортируем наш слайс

// Создаем store
export const store = configureStore({
    reducer: {
        engines: enginesReducer, // Добавляем редьюсер enginesSlice в store
    },
});

// Экспортируем типы для использования в приложении
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;