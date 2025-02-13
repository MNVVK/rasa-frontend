import {mockEngines} from "./data.ts";

const API_BASE_URL = '/api';

/**
 * Получает список двигателей с возможной фильтрацией по названию.
 * @param engineName - Фильтр по имени двигателя (опционально).
 * @returns Массив двигателей из тела ответа.
 */
export const fetchEngines = async (engineName: string = "") => {
    try {
        const response = await fetch(`${API_BASE_URL}/engines?engine_title=${encodeURIComponent(engineName)}`);
        if (!response.ok) {
            throw new Error(`Ошибка загрузки списка двигателей: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        return data.data; // Возвращаем только список двигателей
    } catch (error) {
        console.error("Ошибка при получении списка двигателей:", error);
        return mockEngines.filter(engine => engine.title.toLowerCase().startsWith(engineName.toLowerCase()));
    }
};

/**
 * Получает данные о конкретном двигателе по ID.
 * @param engineId - ID двигателя.
 * @returns Полное тело ответа с данными о двигателе.
 */
export const fetchEngineById = async (engineId: string | undefined) => {
    try {
        const response = await fetch(`${API_BASE_URL}/engines/${engineId}`);
        if (!response.ok) {
            throw new Error(`Ошибка загрузки двигателя ${engineId}: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Ошибка при получении данных двигателя ${engineId}:`, error);
        return mockEngines.find(engine => engine.id.toString() === engineId);
    }
};
