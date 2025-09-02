import { Api } from './Api';

// Определяем Tauri динамически (для desktop) или через .env-переменную
export const tauri: boolean =
  (typeof window !== 'undefined' && !!(window as any).__TAURI__) ||
  (import.meta as any).env?.VITE_TAURI === 'true';

// Базовый URL берём из .env (VITE_API_BASE) — единая точка правды
const envBase = (import.meta as any).env?.VITE_API_BASE as string | undefined;
const baseURL = (envBase ? envBase.replace(/\/+$/, '') : 'http://localhost:8000/api');

// Один клиент для всех; с куками
export const api = new Api({
  baseURL,
  withCredentials: true,
});
